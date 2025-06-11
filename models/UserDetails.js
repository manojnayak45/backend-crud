const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // assuming your user model is named "User"
  },
  name: String,
  email: String,
  phone: String,
  address: String,
  age: Number,
});

module.exports = mongoose.model("UserDetails", userDetailsSchema);
