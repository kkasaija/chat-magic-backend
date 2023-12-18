const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

//Encrypt password before saving user object in database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  //encrypt password
  this.password = await bcrypt.hash(this.password, 10);
  this.confirm_password = undefined;
  next();
});

//check if provided password matches database password during login
UserSchema.methods = {
  isAuthentic: async function (pswd) {
    //the first parameter of bcrypt.compare() must be a plain text string
    return await bcrypt.compare(pswd, this.password);
  },

  isUserUpdated: async function (signedInAt) {
    //const seconds_since_last_update = this.updatedAt.getTime() / 1000;
    return signedInAt < this.updatedAt.getTime() / 1000;
  },

  generateJWToken: function () {
    return jwt.sign({ id: this._id }, process.env.S_KEY, {
      expiresIn: process.env.JWT_AGE,
    });
  },
};

module.exports = mongoose.model("User", UserSchema);
