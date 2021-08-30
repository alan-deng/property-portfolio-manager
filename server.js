const express = require("express");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");
mongoose.connect("mongodb://localhost:27017/properties-manager", {
  useNewUrlParser: true,
});

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use("/users", usersRouter);
const User = require("./models/users");
const Property = require("./models/properties");
// User.insertMany(
//   [
//     {
//       login: "john smith",
//       ownedProperties: [],
//     },
//     {
//       login: "jacob tennerman",
//       ownedProperties: [],
//     },
//   ],
//   () => console.log("added")
// );
//
// Property.insertMany([
//   {
//     name: "house by the ocean",
//     address: "222 2 st",
//   },
//   {
//     name: "eiffel tower",
//     buyPrice: 99999999,
//     address: "Vegas somewhere?",
//   },
// ]);

// User.findByIdAndUpdate(
//   "61294bb5428716b4246b7f6b",
//   {
//     $push: {
//       ownedProperties: {
//         $each: ["61294f08626306729b037878", "61294f08626306729b037877"],
//       },
//     },
//   },
//   () => console.log("pushed")
// );

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.listen(PORT);



