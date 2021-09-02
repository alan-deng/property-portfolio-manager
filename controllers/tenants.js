const Property = require("../models/properties");
const Tenant = require("../models/tenants");
const tenantsRouter = require("express").Router({ mergeParams: true });

// URL is /users/:userId/properties/:propertyId/tenants
// all routes are for a specific property
// property id can be accessed by req.params.propertyId in all below routes

//================Route====================
// New
tenantsRouter.get("/new", (req, res) => {
  Property.findById(req.params.propertyId, (err, property) => {
    if (err) {
      res.send(err);
    } else {
      res.render("./tenants/new.ejs", {
        propertyRented: property,
        userId: req.params.userId,
        propertyId: req.params.propertyId,
      });
    }
  });
});

// Show
tenantsRouter.get("/:id", (req, res) => {
  const tenantId = req.params.id;
  Tenant.findById(tenantId, (err, tenant) => {
    if (err) {
      res.send(err);
    } else {
      res.render("./tenants/show.ejs", {
        tenant: tenant,
        id: tenantId,
        userId: req.params.userId,
        propertyId: req.params.propertyId
      });
    }
  });
});

//Index Route
tenantsRouter.get("/", (req, res) => {
  Property.findById(req.params.propertyId)
    .populate("tenants")
    .exec((err, property) => {
      if (err) {
        res.send(err);
      } else {
        res.render("./tenants/index.ejs", {
          tenants: property.tenants,
          userId: req.params.userId,
          propertyId: req.params.propertyId,
          property: property
          // commenting out until sessions implemented
          // currentUser: req.session.currentUser,
        });
      }
    });
});

// New Post
tenantsRouter.post("/", (req, res) => {
  try {
    Tenant.create(req.body, (err, newTeanant) => {
      Property.findByIdAndUpdate(
        req.body.propertyRented,
        { $push: { tenants: newTeanant._id } },
        { new: true },
        (err, updatedProperty) => {
          console.log(err || updatedProperty);
        }
      );
      res.redirect(
        `/users/${req.params.userId}/properties/${req.params.propertyId}`
      );
    });
  } catch (err) {
    console.error(err);
    res.send("Unable to create tenant");
  }
});

// Edit
tenantsRouter.get("/:id/edit", (req, res) => {
  Tenant.findById(req.params.id, (err, tenant) => {
    if (err) {
      res.send(err);
    } else {
      res.render("./tenants/edit.ejs", {
        tenant: tenant,
        userId: req.params.userId,
        propertyId: req.params.propertyId
      });
    }
  });
});

// PUT&Update
tenantsRouter.put("/:id", (req, res) => {
  Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect(
        `/users/${req.params.userId}/properties/${req.params.propertyId}`
      );
    }
  });
});

// Delete
tenantsRouter.delete("/:id", (req, res) => {
  Property.findByIdAndUpdate(req.params.propertyId, {$pull: {tenants: req.params.id}}, {new: true}, (err, updatedProperty) => {
    console.log(err || updatedProperty)
  })
  Tenant.findByIdAndDelete(req.params.id, (err, deletedTenant) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect(
        `/users/${req.params.userId}/properties/${req.params.propertyId}`
      );
    }
  });
});

module.exports = tenantsRouter;
