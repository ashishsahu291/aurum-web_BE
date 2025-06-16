const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 15,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
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
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(req) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(15).required(),
    imageUrl: Joi.string().required(),
    userId: Joi.string().required(),
    isActive: Joi.boolean(),
  });

  return schema.validate(req);
}

module.exports.Category = Category;
module.exports.validate = validateCategory;
