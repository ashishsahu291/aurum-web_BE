const mongoose = require("mongoose");
const Joi = require("joi");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    maxlength: 250,
    required: true,
  },
  desc: {
    type: String,
    minlength: 10,
    maxlength: 500,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publishedOn: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  updatedBy: {
    type: new mongoose.Schema({
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
      },
    }),
    required: true,
  },
});

const Blog = mongoose.model("Blogs", blogSchema);

function validateBlogs(req) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(250).required(),
    desc: Joi.string().min(10).max(500).required(),
    imageUrl: Joi.string().required(),
    publishedOn: Joi.date().required(),
    updatedAt: Joi.date(),
    userId: Joi.string().required(),
  });

  return schema.validate(req);
}

module.exports.Blog = Blog;
module.exports.validate = validateBlogs;
