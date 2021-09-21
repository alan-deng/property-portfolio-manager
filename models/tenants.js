const mongoose = require("mongoose");
const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rent: Number,
  contactNum: Number,
  contactEmail: String,
  propertyRented: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
});

const Tenant = mongoose.model("Tenant", tenantSchema);
module.exports = Tenant;
