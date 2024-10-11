const mongoose = require("mongoose");
// const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  avatar: {
    type: String,
    default: "../uploads/user-1.png", // default avatar image when no image uploaded by user.
  },
});

module.exports = mongoose.model("User", userSchema);
