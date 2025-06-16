const _ = require("lodash");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validate, User } = require("../models/user");
const router = express.Router();
require("dotenv").config();

router.post("/", async (req, res) => {
  //  Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //  Check the user is already registered or not
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User is already registered!");

  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));

  // Encrypt the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "isAdmin"]));
});

module.exports = router;
