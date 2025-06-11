const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  age: Number,
});

module.exports = mongoose.model("UserDetails", userDetailsSchema);
