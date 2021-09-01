const axios = require("axios").default;
require("dotenv").config();
const bcrypt = require('bcrypt')
const User = require("../models/users");

exports.feeParser = (req) => {
  let fees = {};
  for (const key in req.body) {
    if (key.includes("fees.")) {
      fees[key.slice(5)] = req.body[key];
    }
  }
  req.body.fees = fees;
};

exports.MapsAPICall = (req) => {
  let encodedAddress =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    encodeURIComponent(req.body.address) +
    `&key=${process.env.APIKEY}`;
  return axios.get(encodedAddress).then(response => {
    let propertyCoords = response.data.results[0].geometry.location;
    req.body.location = propertyCoords;
}).catch((err)=>{
  console.log(err);
});
};

exports.passwordHash = (password) => {
  const salt = bcrypt.genSaltSync(5);
  return bcrypt.hashSync(password, salt);
}
