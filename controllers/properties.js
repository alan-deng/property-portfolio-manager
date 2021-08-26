const express = require("express");
const Property = require("../models/properties.js");
const router = express.Router();

//Index
router.get("/", (req, res) => {
  Property.find({}, (err, allProperties) => {
    if (err) {
      res.send(err);
    } else {
      res.render("./properties/index.ejs", {
        allProperties: allProperties,
      });
    }
  });
});

//New
router.get("/new", (req, res) => {
  if (err) {
    res.send(res.send("error 404"));
  } else {
    res.render("./properties/new.ejs");
  }
});


//Show
router.get("/:idx", (req, res) => {
  Property.find({ _id: req.params.idx }, (err, property) => {
    if (err) {
      res.send("error 404 property not found");
    } else {
      res.render("./properties/show.ejs", {
        property: property,
      });
    }
  });
});


//New POST
router.post("/", (req, res) => {
  if (err) {
    res.send(res.send("error 404"));
  } else {
    Property.create(req.body);
    res.redirect("/");
  }
});

//Edit Page
router.get("/:idx/edit", (req, res) => {
  Property.find({ _id: req.params.idx }, (err, property) => {
    if (err) {
      res.send(res.send("error 404"));
    } else {
      res.render("./properties/edit.ejs", {
        property: property,
      });
    }
  });
});

//Update
router.put("/:idx", (req, res) => {
  Property.findByIdAndUpdate(req.params.idx, req.body, { new: true });
  res.redirect(`/${req.params.idx}`);
});

//Delete Route
router.delete("/:idx", (req, res) => {
  Property.findByIdAndDelete(req.params.idx, (err, deletedProperty) => {
    if (err) {
      res.send(res.send("error 404"));
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
