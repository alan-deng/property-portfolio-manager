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
const calculations = require("./public/calculations");
const User = require("./models/users");
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

app.use("/users", usersRouter);


app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req,res)=>{
  res.render('register.ejs')
})

app.post("/", async (req, res) => {
  User.findOne({login: req.body.login}, (err, foundUser) => {
    const hashedPassword = foundUser.password  
    bcrypt.compareSync(req.body.password, hashedPassword)
    ? res.redirect(`/users/${foundUser._id}/properties`)
    : res.redirect('/')
  } )
})

app.listen(port);
