const express = require('express')
const Property = require("../models/properties");
const Tenant = require("../models/tenants");
const tenantsRouter = require('express').Router({ mergeParams: true });


// URL is /users/:userId/properties/:propertyId/tenants
// all routes are for a specific property
// property id can be accessed by req.propertyId in all below routes

//================Route====================
// New
tenantsRouter.get('/new', (req,res)=>{
  res.render('./tenants/new.ejs')
})

// Show
tenantsRouter.get('/:id', (req,res)=>{
  const id = req.params.id
  Tenant.findById(id, (err,tenant)=>{
    if(err){
      res.send(err)
    }else{
      res.render('./tenants/show.ejs',{
        tenant: tenant,
        id: id
      })
    }
  })
})

tenantsRouter.get('/user/tenants', (req,res)=>{
  if(req.session.currentUser){
    Tenant.find({propertyRented: req.session.currentUser._id},(err,allTenants)=>{
      if(err){
        res.send(err)
      }else{
        console.log(allTenants)
        res.render('./tenants/index.ejs',{
          tenants: allTenants,
          currentUser: req.session.currentUser
        })
      }
    })
  }else{
    res.redirect('/')
  }
})

//Index Route
tenantsRouter.get('/',(req,res)=>{
  console.log(req.session);
  Tenant.find({},(err,allTenants)=>{
    if(err){
      res.send(err)
    }else{
      res.render('./tenants/index.ejs',{
        tenants: allTenants,
        currentUser: req.session.currentUser
      })
    }
  })
})

// New Post
tenantsRouter.post('/', async (req,res)=>{
  try {
    const foundName = req.session.currentUser.name;
    let loggedInUser = await User.findOne({ name : foundName });
    
    let newTenant = await tenant.create({ ...req.body, propertyRented : loggedInUser});
    newTenant.propertyRented = loggedInUser;
    
    await newTenant.save();
    return res.redirect('./tenants')
  }catch(entered) {
    console.error(e);
    res.send("Something went wrong")
  }
})

// Edit
tenantsRouter.get('/:id/edit', (req,res)=>{
  Tenant.find({_id: req.params.id}, (err,tenant)=>{
    if(err){
      res.send(err)
    }else {
      res.render('./tenants/edit.ejs',{
        tenant: tenant
      })
    }
  })
})

// PUT&Update
tenantsRouter.put('/:id', (req,res)=>{
  const id = req.params.id
  const updatedTenantData = req.body
  Tenant.findByIdAndUpdate(id, updatedTenantData, {new: true}, (err,updatedTenantData)=>{
    if(err){
      res.send(err)
    }else{
      res.redirect('/${req.params.id}')
    }
  })
})

// Delete
tenantsRouter.delete('/:id', (req,res)=>{
  Tenant.findByIdAndDelete(req.params.id, (err,deletedTenant)=>{
    if(err){
      res.send(err)
    }else{
      res.redirect('/')
    }
  })
})



module.exports = tenantsRouter
