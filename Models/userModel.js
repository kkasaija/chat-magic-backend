const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

UserSchema.methods = {
  //check if provided password matches database password during login
  isAuthentic: async function (password) {
    return await bcrypt.compare(this.password, password);
  },
};

//Encrypt password before saving user object in database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  //encrypt password
  this.password = await bcrypt.hash(this.password, 12);
  this.confirm_password = undefined;
  next();
});

module.exports = mongoose.model("User", UserSchema);
