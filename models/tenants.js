const mongoose = require('mongoose')
const tenantSchema = new mongoose.Schema({
    name: String,
    rent: Number,
    contactNum: Number,
    contactEmail: String,
    propertyRented: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }
})

const Tenant = mongoose.model('Tenant', tenantSchema)
module.exports = Tenant