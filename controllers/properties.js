const express = require("express");
const Property = require("../models/properties");
const User = require("../models/users");
const propertiesRouter = express.Router();
const tenantsRouter = require("./tenants");

//route is /users/:userId/properties

//Index
propertiesRouter.get("/", (req, res) => {
  User.findById(req.userId)
    .populate("ownedProperties")
    .exec((err, user) => {
      if (err) {
        res.send(err);
      } else {
        console.log(user);
        res.render("./properties/index.ejs", {
          userProperties: user.ownedProperties,
        });
      }
    });
});

//New
propertiesRouter.get("/new", (req, res) => {
  res.render("./properties/new.ejs");
});

//Show
propertiesRouter.get("/:idx", (req, res) => {
  Property.findById(req.params.idx, (err, property) => {
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
propertiesRouter.post("/", (req, res) => {
  if (err) {
    res.send("error creating property");
  } else {
    Property.create(req.body);
    res.redirect("/");
  }
});

//Edit Page
propertiesRouter.get("/:idx/edit", (req, res) => {
  Property.findById(req.params.idx, (err, property) => {
    if (err) {
      res.send("error 404 user not found");
    } else {
      res.render("./properties/edit.ejs", {
        property: property,
      });
    }
  });
});

//Update
propertiesRouter.put("/:idx", (req, res) => {
  Property.findByIdAndUpdate(req.params.idx, req.body, { new: true }, (err) => {
    if (err) {
      res.send("error updating property");
    } else {
      res.redirect(`/${req.params.idx}`);
    }
  });
});

//Delete Route
propertiesRouter.delete("/:idx", (req, res) => {
  Property.findByIdAndDelete(req.params.idx, (err) => {
    if (err) {
      res.send("error deleting property");
    } else {
      res.redirect("/");
    }
  });
});

propertiesRouter.use(
  "/:propertyId/tenants",
  (req, res, next) => {
    req.propertyId = req.params.propertyId;
    next();
  },
  tenantsRouter
);

module.exports = propertiesRouter;
