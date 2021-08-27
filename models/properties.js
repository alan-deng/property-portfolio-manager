const mongoose = require('mongoose')
const propertySchema = new mongoose.Schema ({
    name: String,
    buyPrice: Number,
    address: String,
    fees: {
        propertyTax: Number,
        hoaFees: Number,
        homeInsurance_cost: Number,
        renterInsuranceCost: Number
    },
    tenants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant'
    }]
    
    
})

const Property = mongoose.model('Property', propertySchema)

module.exports = Property