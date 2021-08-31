require('dotenv').config()
const express = require("express");
const app = express();
const port = 3000;
const PORT = process.env.PORT
const mongodbURI = process.env.MONGODBURI
const session = require('express-session');
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const usersRouter = require('./controllers/users')
const tenantsRouter =require('./controllers/tenants')
mongoose.connect("mongodb://localhost:27017/properties-manager", {
  useNewUrlParser: true,
});

//===============Middleware===================
app.use(
  session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false
  })
)

app.use((req,res,next)=>{
  req.session.isOnline = true
  next();
})
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use('/tenants', tenantsRouter);
app.use("/users", usersRouter);
const User = require('./models/users')
const Property = require('./models/properties')
// User.insertMany([
//   {
//     login: 'john smith',
//     ownedProperties: []
//   },
//   {
//     login: 'jacob tennerman',
//     ownedProperties: []
//   }
// ], () => console.log('added'))

// Property.insertMany([
//   {
//     name: 'house by the ocean',
//     address: '222 2 st',
//   },
//   {
//     name: 'eiffel tower',
//     buyPrice: 99999999,
//     address: 'Vegas somewhere?',
//   }
// ])

// User.findByIdAndUpdate('612831ece50aad2bd174c1d5', {
//   $push: {ownedProperties: {$each: ['612832c6e58e164b8f09b08c', '612832c6e58e164b8f09b08d']}}
// }, () => console.log('pushed'))

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req,res)=>{
  res.render('register.ejs')
})

app.listen(port);
