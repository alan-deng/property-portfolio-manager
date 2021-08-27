const express = require("express");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const usersRouter = require('./controllers/users')
mongoose.connect("mongodb://localhost:27017/properties-manager", {
  useNewUrlParser: true,
});

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));


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

app.listen(PORT);
