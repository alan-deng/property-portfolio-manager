const User = require("../models/users");
const usersRouter = require("express").Router();
const propertiesRouter = require("./properties");

// Index
// ... There shouldn't be an index for all users.

//New
usersRouter.get("/new", (req, res) => {
  res.render("./users/new.ejs", {
    userId: req.body.params,
  });
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
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.redirect(`/users/${createdUser._id}/properties`);
    }
  });
});

//Edit Page
usersRouter.get("/:idx/edit", (req, res) => {
  User.find({ _id: req.params.idx }, (err, user) => {
    if (err) {
      res.send("error 404 user not found");
    } else {
      res.render("./users/edit.ejs", {
        user: user,
        userId: req.params.idx,
      });
    }
  });
});

//Update
usersRouter.put("/:idx", (req, res) => {
  if (req.body.password === req.body.password1) {
    User.findByIdAndUpdate(req.params.idx, req.body, { new: true }, (err) => {
      if (err) {
        res.send("error updating user information");
      } else {
        res.redirect(`/users/${req.params.idx}/properties`);
      }
    });
  } else {
    res.send("error, passwords do not match");
  }
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
