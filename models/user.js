const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
  },
});

usersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model("User", usersSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(25).required(),
    email: Joi.string().min(5).max(30).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.boolean().required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
