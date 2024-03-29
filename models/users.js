const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // googleId: String,
  ownedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
});
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);
module.exports = User;
