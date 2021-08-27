const express = require("express");
const Property = require("../models/properties");
const Tenant = require("../models/tenants");
const tenantsRouter = express.Router();

// URL is /users/:userId/properties/:propertyId/tenants
// all routes are for a specific property
// property id can be accessed by req.propertyId in all below routes