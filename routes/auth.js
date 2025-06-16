const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const router = express.Router();
require("dotenv").config();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({
      status: 400,
      code: "BAD_REQUEST",
      message: "Invalid email and Password!",
    });

  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!validPwd)
    return res.status(400).send({
      status: 400,
      code: "BAD_REQUEST",
      message: "Invalid Password!",
    });

  const token = user.generateAuthToken();

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    tokens: {
      accessToken: token,
    },
  });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(25).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate(req);
}

module.exports = router;
