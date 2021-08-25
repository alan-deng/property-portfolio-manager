const express = require("express");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/properties-manager", {
  useNewUrlParser: true,
});

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const propertiesController = require("./controllers/properties");
app.use("/properties", propertiesController);

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.listen(PORT);
