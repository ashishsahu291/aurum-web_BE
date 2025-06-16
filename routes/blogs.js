const express = require("express");
const { Blog, validate } = require("../models/blog");
const { User } = require("../models/user");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid User!");

  const blog = new Blog({
    title: req.body.title,
    desc: req.body.desc,
    imageUrl: req.body.imageUrl,
    publishedOn: req.body.publishedOn,
    updatedBy: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });

  await blog.save();
  res.send(blog);
});

router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ publishedOn: "1" });
  res.send(blogs);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(400).send("The Blog with the given ID was not found!");
  }

  res.send(blog);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid User!");

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      desc: req.body.desc,
      imageUrl: req.body.imageUrl,
      publishedOn: req.body.publishedOn,
      updatedBy: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    { new: true }
  );

  if (!blog)
    return res.status(400).send("The blog with the given ID was not found!");

  res.send(blog);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const blog = await Blog.findByIdAndRemove(req.params.id);

  if (!blog)
    return res.status(400).send("The blog with the given ID was not found!");

  res.send(blog);
});

module.exports = router;
