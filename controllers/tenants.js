const express = require('express')
const Property = require("../models/properties");
const Tenant = require("../models/tenants");
const User = require('../models/users')
const tenantsRouter = require('express').Router({ mergeParams: true });
const bcrypt = require('bcrypt')


// URL is /users/:userId/properties/:propertyId/tenants
// all routes are for a specific property
// property id can be accessed by req.propertyId in all below routes

//================Route====================
// New
tenantsRouter.get('/new', (req,res)=>{
  res.render('./tenants/new.ejs')
})

// "/" = "/tenants"

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
      res.redirect(`/${req.params.id}`)
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
