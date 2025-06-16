const mongoose = require("mongoose");
const Joi = require("joi");

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    maxlength: 20,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Gallery = mongoose.model("Gallery", gallerySchema);

function validateGallery(req) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(20).required(),
    imageUrl: Joi.string().required(),
    updatedAt: Joi.date(),
  });

  return schema.validate(req);
}

module.exports.Gallery = Gallery;
module.exports.validate = validateGallery;
