const User = require("../models/users");
const usersRouter = require("express").Router();
const propertiesRouter = require("./properties");

// Index
// ... There shouldn't be an index for all users.

//New
usersRouter.get("/new", (req, res) => {
  res.render("./users/new.ejs");
});

//Show
usersRouter.get("/:idx", (req, res) => {
  User.findById(req.params.idx, (err, user) => {
    if (err) {
      res.send("error 404 user not found");
    } else {
      res.render("./users/show.ejs", {
        user: user,
      });
    }
  });
});

//New POST
usersRouter.post("/", (req, res) => {
  if (err) {
    res.send("error creating user");
  } else {
    User.create(req.body);
    res.redirect("/");
  }
});

//Edit Page
usersRouter.get("/:idx/edit", (req, res) => {
  User.find({ _id: req.params.idx }, (err, user) => {
    if (err) {
      res.send("error 404 user not found");
    } else {
      res.render("./users/edit.ejs", {
        user: user,
      });
    }
  });
});

//Update
usersRouter.put("/:idx", (req, res) => {
  User.findByIdAndUpdate(req.params.idx, req.body, { new: true });
  res.redirect(`/${req.params.idx}`);
});

//Delete Route
usersRouter.delete("/:idx", (req, res) => {
  User.findByIdAndDelete(req.params.idx, (err, deletedUser) => {
    if (err) {
      res.send("error deleting user");
    } else {
      res.redirect("/");
    }
  });
});

usersRouter.use("/:userId/properties", propertiesRouter);

module.exports = usersRouter;
