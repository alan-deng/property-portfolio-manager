const User = require("../models/users");
const usersRouter = require("express").Router();
const propertiesRouter = require("./properties");
const bcrypt = require('bcrypt')

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
  const pwHash = bcrypt.hashSync(req.body.password, 10)
  req.body.password = pwHash;
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      res.redirect(`/users/${createdUser._id}/properties`);
    }
  });
});

//Edit Page
usersRouter.get("/:idx/edit", (req, res) => {
  User.findById(req.params.idx, (err, user) => {
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
    User.findByIdAndUpdate(req.params.idx, req.body, {
      new: true
    }, (err) => {
      if (err) {
        res.send("error updating tenant's information");
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
