//AWS image uploads
require("../config/aws");
const express = require("express"); //is this needed? already in server.js
const multer = require("multer");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const upload = multer({ dest: "uploads/" });

const Property = require("../models/properties");
const User = require("../models/users");
const propertiesRouter = require("express").Router({
  mergeParams: true,
});
const tenantsRouter = require("./tenants");
const calculations = require("../public/calculations");
const auth = require("./auth");
const { uploadFile, deleteFile } = require("../s3");
// URL is /users/:userId/properties
// all routes are for a specific user
// user id can be accessed by req.params.userId in all below routes

//auth middleware
propertiesRouter.use(auth.isAuth);

//Index for a particular user's properties
propertiesRouter.get("/", (req, res) => {
  User.findById(req.params.userId)
    .populate({ path: "ownedProperties", populate: { path: "tenants" } })
    .exec((err, user) => {
      if (err) {
        res.redirect("/error");
      } else {
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

// Map page
propertiesRouter.get("/map", (req, res) => {
  User.findById(req.params.userId)
    .populate({ path: "ownedProperties", populate: { path: "tenants" } })
    .exec((err, user) => {
      res.render("./properties/map.ejs", {
        userProperties: JSON.stringify(user.ownedProperties),
        APIKEY: process.env.APIKEY,
        userId: req.params.userId,
      });
    });
});
//Show (needs properties index view to link to '/users/:userId/properties/:idx)
propertiesRouter.get("/:idx", (req, res) => {
  Property.findById(req.params.idx)
    .populate("tenants")
    .exec((err, property) => {
      if (err) {
        res.redirect("/error");
      } else {
        res.render("./properties/show.ejs", {
          property: property,
          userId: req.params.userId,
        });
      }
    });
});

//New POST
propertiesRouter.post("/", upload.single("img_upload"), async (req, res) => {
  // Upload to AWS S3 and record relavant data
  const result = await uploadFile(req.file);
  await unlinkFile(req.file.path);
  req.body.img = result.Location;
  req.body.imgS3Key = result.Key;
  // calculations is imported from the public/calculations file
  calculations.feeParser(req);
  calculations.MapsAPICall(req).then(() => {
    Property.create(req.body, (err, property) => {
      if (err) {
        res.redirect("/error");
      } else {
        User.findByIdAndUpdate(
          req.params.userId,
          { $push: { ownedProperties: property._id } },
          (err) => {
            if (err) {
              res.redirect("/error");
            } else {
              res.redirect(`/users/${req.params.userId}/properties`);
            }
          }
        );
      }
    });
  });
});

//Edit Page
propertiesRouter.get("/:idx/edit", (req, res) => {
  Property.findById(req.params.idx, (err, property) => {
    if (err) {
      res.redirect("/error");
    } else {
      res.render("./properties/edit.ejs", {
        property: property,
        userId: req.params.userId,
      });
    }
  });
});

//Update
propertiesRouter.put("/:idx", upload.single("img_upload"), async (req, res) => {
  calculations.feeParser(req);
  if (req.file) {
    const result = await uploadFile(req.file);
    await unlinkFile(req.file.path);
    req.body.img = result.Location;
    req.body.imgS3Key = result.Key;
  }
  Property.findByIdAndUpdate(
    req.params.idx,
    req.body,
    // returns old property so we can get the s3 key to delete
    async (err, oldProp) => {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        if (req.file) {
          await deleteFile(oldProp.imgS3Key);
        }
        res.redirect(
          `/users/${req.params.userId}/properties/${req.params.idx}`
        );
      }
    }
  );
});

//Delete Route
propertiesRouter.delete("/:idx", (req, res) => {
  Property.findByIdAndDelete(req.params.idx, async (err, deletedProp) => {
    if (err) {
      res.redirect("/error");
    } else {
      if (deletedProp.imgS3Key) {
        await deleteFile(deletedProp.imgS3Key);
      }
      User.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: req.params.idx,
        },
        (err) => {
          if (err) {
            res.redirect("/error");
          }
        }
      );
      res.redirect(`/users/${req.params.userId}/properties`);
    }
  });
});

propertiesRouter.use("/:propertyId/tenants", tenantsRouter);

module.exports = propertiesRouter;
