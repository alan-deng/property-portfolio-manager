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
  Tenant.findById(req.params.id, (err,tenant)=>{
    if(err){
      res.send(err)
    }else{
      res.render('./tenants/show.ejs',{
        tenant: tenant
      })
    }
  })
})

// New Post
tenantsRouter.post('/', (req,res)=>{
  if(err){
    res.send(err)
  }else {
    Tenant.create(req.body)
    res.redirect('/')
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

// Update
tenantsRouter.put('/:id', (req,res)=>{
  Tenant.findByIdAndUpdate(req.params.id, req.body, {new: true})
  res.redirect('/${req.params.id}')
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
