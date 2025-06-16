require("dotenv").config();
const users = require("./routes/users");
const auth = require("./routes/auth");
const categories = require("./routes/categories");
const blogs = require("./routes/blogs");
const gallery = require("./routes/galleries");
const menus = require("./routes/menus");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

if (!process.env.JWT_PRIVATE_KEY) {
  console.error("FATAL ERROR: JWT_PRIVATE_KEY is not defained!");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/aurum")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log(`couldn't connect to DB...`));

app.use(cors());
app.use(express.json());
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/categories", categories);
app.use("/api/v1/blogs", blogs);
app.use("/api/v1/gallery", gallery);
app.use("/api/v1/menus", menus);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening PORT ${port}`));
