const mongoose = require("mongoose");

const userSchema = await new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field cannot be empty"],
  },

  email: {
    type: String,
    required: [true, "Email field cannot be empty"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "password field cannot be empty"],
    minLength: 6,
  },
});

module.exports = mongoose.model("User", userSchema);
