const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");

const tokenGen = (payload) => {
  return jwt.sign(payload, process.env.S_KEY, {
    expiresIn: process.env.MAX_AGE,
  });
};

exports.isOwnProfile = async (req, res, next) => {
  try {
    let token = req.headers.authorization ? req.headers.authorization : null;
    if (!token) throw new Error("You are not authenticated. Please login");

    if (token.startsWith("Bearer")) {
      token = await util.promisify(jwt.verify)(
        token.split(" ")[1],
        process.env.S_KEY
      );
    }

    const owner = req.user && token && token.id === req.user._id;
    if (!owner) {
      throw new Error("You are not authorized to perform this action");
    }
    next();
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if email and password are provided
    if (!email || !password)
      throw new Error("Email and password are required for signing in");

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not registered");
    //check if email/ password matched

    if (!(await user.isAuthentic(password)))
      throw new Error("User email/password incorrect");

    //if all conditions matched, generate toten and render user
    const token = tokenGen({ id: user._id });
    user.password = undefined;
    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.signOut = async (req, res) => {};

exports.register = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error,
    });
  }
};
