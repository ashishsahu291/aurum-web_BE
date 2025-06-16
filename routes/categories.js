const express = require("express");
const router = express.Router();
const { validate, Category } = require("../models/category");
const { User } = require("../models/user");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid User!");

  let category = new Category({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    createdBy: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });

  await category.save();

  res.send(category);
});

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ title: 1 });
  res.send(categories);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res
      .status(400)
      .send("The Category with the given ID was not found.");
  }

  res.send(category);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid User!");

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      createdBy: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      isActive: req.body.isActive,
    },
    { new: true }
  );

  if (!category)
    return res
      .status(400)
      .send("The category with the given ID was not found!");

  res.send(category);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category)
    return res
      .status(400)
      .send("The category with the given ID was not found!");

  res.send(category);
});

module.exports = router;
