const express = require("express");
const { Category } = require("../models/category");
const { Menu, validate } = require("../models/menu");
const { User } = require("../models/user");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category)
    return res
      .status(400)
      .send("The Category with the given ID was not found!");

  const user = await User.findById(req.body.userId);
  if (!user)
    return res.status(400).send("The User with the given ID was not found!");

  const menu = new Menu({
    title: req.body.title,
    ingredients: req.body.ingredients,
    price: req.body.price,
    desc: req.body.desc,
    category: {
      _id: category._id,
      title: category.title,
    },
    imageUrl: req.body.imageUrl,
    isGulten: req.body.isGulten,
    isVegan: req.body.isVegan,
    isNut: req.body.isNut,
    isDiary: req.body.isDiary,
    preparationTime: req.body.preparationTime,
    updatedBy: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });

  await menu.save();
  res.send(menu);
});

router.get("/", async (req, res) => {
  const menus = await Menu.find();
  res.send(menus);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const menu = await Menu.findById(req.params.id);

  if (!menu)
    return res.status(400).send("The menu with the given ID was not found!");

  res.send(menu);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category)
    return res
      .status(400)
      .send("The Category with the given ID was not found!");

  const user = await User.findById(req.body.userId);
  if (!user)
    return res.status(400).send("The User with the given ID was not found!");

  const menu = await Menu.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      ingredients: req.body.ingredients,
      price: req.body.price,
      desc: req.body.desc,
      category: {
        _id: category._id,
        title: category.title,
      },
      imageUrl: req.body.imageUrl,
      isGulten: req.body.isGulten,
      isVegan: req.body.isVegan,
      isNut: req.body.isNut,
      isDiary: req.body.isDiary,
      preparationTime: req.body.preparationTime,
      updatedBy: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    { new: true }
  );

  if (!menu)
    return res.status(400).send("The menu with the given ID was not found!");

  res.send(menu);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const menu = await Menu.findByIdAndRemove(req.params.id);

  if (!menu)
    return res.status(400).send("The menu with the given ID was not found!");

  res.send(menu);
});

module.exports = router;
