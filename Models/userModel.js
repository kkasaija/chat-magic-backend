const mongoose = require("mongoose");

const userSchema = await new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field cannot be empty"],
    },

    email: {
      type: String,
      required: [true, "Email field cannot be empty"],
      unique: [true, "Email already exists"],
    },

    password: {
      type: String,
      required: [true, "password field cannot be empty"],
      minLength: 6,
      select: false,
    },

    confirm_password: {
      type: String,
      required: [true, "password field cannot be empty"],
      validate: {
        //this validator only works for save() and create() methods
        validator: function (conf_pass) {
          return conf_pass === this.password;
        },
        message: "The provided passwords do not match",
      },
    },

    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
