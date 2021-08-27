const express = require('express')
const router = express.Router()
const User = require('../models/users')

// Index
// ... There shouldn't be an index for all users. 

//New
router.get("/new", (req, res) => {
    if (err) {
      res.send("error 404 page not found");
    } else {
      res.render("./users/new.ejs");
    }
  });

//Show
router.get("/:idx", (req, res) => {
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
router.post("/", (req, res) => {
if (err) {
    res.send("error creating user");
} else {
    User.create(req.body);
    res.redirect("/");
}
});

//Edit Page
router.get("/:idx/edit", (req, res) => {
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
router.put("/:idx", (req, res) => {
User.findByIdAndUpdate(req.params.idx, req.body, { new: true });
res.redirect(`/${req.params.idx}`);
});

//Delete Route
router.delete("/:idx", (req, res) => {
User.findByIdAndDelete(req.params.idx, (err, deletedUser) => {
    if (err) {
    res.send("error deleting user");
    } else {
    res.redirect("/");
    }
});
});




module.exports = router