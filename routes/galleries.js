const { Gallery, validate } = require("../models/gallery");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const gallery = new Gallery({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
  });

  await gallery.save();
  res.send(gallery);
});

router.get("/", async (req, res) => {
  const gallery = await Gallery.find().sort({ updatedAt: "1" });
  res.send(gallery);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const gallery = await Gallery.findByIdAndRemove(req.params.id);

  if (!gallery)
    return res.status(400).send("The image with the given ID was not found!");

  res.send(gallery);
});

module.exports = router;
