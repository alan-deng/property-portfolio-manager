const Property = require("../models/properties");
const Tenant = require("../models/tenants");
const tenantsRouter = require('express').Router();

// URL is /users/:userId/properties/:propertyId/tenants
// all routes are for a specific property
// property id can be accessed by req.propertyId in all below routes

module.exports = tenantsRouter