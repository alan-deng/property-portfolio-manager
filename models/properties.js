const mongoose = require('mongoose')
const propertySchema = new mongoose.Schema ({
    name: String,
    price: Number,
    property_tax: Number,
    hoa_fees: Number,
    home_insurance_cost: Number,
    renter_insurance_cost: Number
})

const Property = mongoose.model('Property', propertySchema)

module.exports = Property