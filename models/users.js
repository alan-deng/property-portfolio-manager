const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ownedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
