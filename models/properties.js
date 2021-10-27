const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  img: String,
  imgS3Key: String,
  name: { type: String, required: true },
  buyPrice: Number,
  address: {
    type: String,
    required: true,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  fees: [
    {
      name: String,
      amount: Number,
    },
  ],
  tenants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },
  ],
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
