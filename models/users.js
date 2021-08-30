const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    login: String,
    password: String,
    ownedProperties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }]
})

const User = mongoose.model('User', userSchema)
module.exports = User
