const mongoose = require("mongoose");
const Joi = require("joi");

const menuSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 5,
    max: 250,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    min: 20,
    max: 500,
    required: true,
  },
  category: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        min: 3,
        max: 15,
      },
    }),
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isGulten: {
    type: Boolean,
    default: false,
  },
  isVegan: {
    type: Boolean,
    default: false,
  },
  isNut: {
    type: Boolean,
    default: false,
  },
  isDiary: {
    type: Boolean,
    default: false,
  },
  preparationTime: {
    type: String,
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
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Menu = mongoose.model("Menu", menuSchema);

function validateMenu(req) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(250).required(),
    ingredients: Joi.required(),
    price: Joi.number().required(),
    desc: Joi.string().min(20).max(500).required(),
    categoryId: Joi.string().required(),
    imageUrl: Joi.string().required(),
    isGulten: Joi.boolean(),
    isVegan: Joi.boolean(),
    isNut: Joi.boolean(),
    isDiary: Joi.boolean(),
    preparationTime: Joi.string(),
    userId: Joi.string().required(),
    isActive: Joi.boolean(),
  });

  return schema.validate(req);
}

module.exports.Menu = Menu;
module.exports.validate = validateMenu;
