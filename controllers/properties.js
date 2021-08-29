const Property = require("../models/properties");
const User = require("../models/users");
const propertiesRouter = require("express").Router({ mergeParams: true });
const tenantsRouter = require("./tenants");
const axios = require('axios').default;

// URL is /users/:userId/properties
// all routes are for a specific user
// user id can be accessed by req.params.userId in all below routes

//Index for a particular user's properties
propertiesRouter.get("/", (req, res) => {
  User.findById(req.params.userId)
    .populate("ownedProperties")
    .exec((err, user) => {
      if (err) {
        res.send(err);
      } else {
        // console.log(user);
        res.render("./properties/index.ejs", {
          userProperties: user.ownedProperties,
          userId: req.params.userId,
        });
      }
    });
});

//New
propertiesRouter.get("/new", (req, res) => {
  res.render("./properties/new.ejs", {
    userId: req.params.userId,
  });
});

//Show (needs properties index view to link to '/users/:userId/properties/:idx)
propertiesRouter.get("/:idx", (req, res) => {
  Property.findById(req.params.idx, (err, property) => {
    if (err) {
      res.send("error 404 property not found");
    } else {
      res.render("./properties/show.ejs", {
        property: property,
        userId: req.params.userId,
      });
    }
  });
});
//New POST
propertiesRouter.post("/", (req, res) => {

//Maps API Code
  // let propertyCoords;
  // let encodedAddress;
  // axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyB_YsGtKFDmwGsHu8hRFj-Q-n8WmYW2Ko0`)
  //   .then(response => {console.log(response.data.results[0].geometry);  propertyCoords = response.data.results[0].geometry })
  //   .then(() => console.log(shit.location))

  
  
  Property.create(req.body, (err, property) => {
    if (err) {
      res.send("error creating property");
    } else {
      User.findByIdAndUpdate(
        req.params.userId,
        { $push: { ownedProperties: property._id } },
        (err) => {
          if (err) {
            res.send("error adding property to list of properties");
          } else {
            res.redirect(`/users/${req.params.userId}/properties`);
          }
        }
      );
    }
  });
});

//Edit Page
propertiesRouter.get("/:idx/edit", (req, res) => {
  Property.findById(req.params.idx, (err, property) => {
    if (err) {
      res.send("error 404 user not found");
    } else {
      res.render("./properties/edit.ejs", {
        property: property,
        userId: req.params.userId,
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
      res.redirect(`/users/${req.params.userId}/properties/${req.params.idx}`);
    }
  });
});

//Delete Route
propertiesRouter.delete("/:idx", (req, res) => {
  Property.findByIdAndDelete(req.params.idx, (err) => {
    if (err) {
      res.send("error deleting property");
    } else {
      User.findByIdAndUpdate(
        req.params.userId,
        { $pull: req.params.idx },
        (err) => {
          if (err) {
            res.send("error removing property from user");
          }
        }
      );
      res.redirect(`/users/${req.params.userId}/properties`);
    }
  });
});

propertiesRouter.use("/:propertyId/tenants", tenantsRouter);

module.exports = propertiesRouter;
