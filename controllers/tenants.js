const express = require("express");
const { findById } = require("../models/properties");
const Property = require("../models/properties");
const Tenant = require("../models/tenants");
<<<<<<< HEAD
const User = require('../models/users')
const tenantsRouter = require('express').Router({ mergeParams: true });
const bcrypt = require('bcrypt')

=======
const tenantsRouter = require("express").Router({ mergeParams: true });
>>>>>>> main

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

// "/" = "/tenants"

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
<<<<<<< HEAD
// tenantsRouter.post('/', async (req,res)=>{
//   try {
//     const foundName = req.session.currentUser.name;
//     let loggedInUser = await User.findOne({ name : foundName });
    
//     let newTenant = await tenant.create({ ...req.body, propertyRented : loggedInUser});
//     newTenant.propertyRented = loggedInUser;
    
//     await newTenant.save();
//     return res.redirect('./tenants')
//   }catch(entered) {
//     console.error(e);
//     res.send("Something went wrong")
//   }
// })

// POST route orginal

// tenantsRouter.post('/',(req,res)=>{
//   if(req.session.currentUser){
//     Tenant.create(req.body, (err,newTenant)=>{
//       if(err){
//         return res.send(err);
//       }
//       console.log("newTenant", newTenant);
//     })
//   }else{
//     res.redirect('/');
//   }
// })

// POST route newone

tenantsRouter.post('/', async (req, res)=>{
  console.log(req.session.currentUser)
  try {
      const foundUsername = req.session.currentUser.login;
      let loggedInUser = await User.findOne({ login : foundUsername });
      
      let newTenant = await Tenant.create({ ...req.body, propertyRented : loggedInUser});
      newTenant.createdBy = loggedInUser;
      
      await newTenant.save();
      console.log('newTenant is : ',newTenant);
      console.log('loggedInUser is :', loggedInUser);
      return res.redirect("/");
    } catch(e) {
      console.error(e);
      res.send("something wen't wrong")
=======
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
>>>>>>> main
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
<<<<<<< HEAD
tenantsRouter.put('/:id', (req,res)=>{
  const id = req.params.id
  const updatedTenantData = req.body
  Tenant.findByIdAndUpdate(id, updatedTenantData, {new: true}, (err,updatedTenantData)=>{
    if(err){
      res.send(err)
    }else{
      res.redirect(`/${req.params.id}`)
=======
tenantsRouter.put("/:id", (req, res) => {
  Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect(
        `/users/${req.params.userId}/properties/${req.params.propertyId}`
      );
>>>>>>> main
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
