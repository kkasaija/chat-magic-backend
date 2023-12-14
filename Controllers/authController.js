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
    const jtoken = req.headers.authorization ? req.headers.authorization : null;
    if (!jtoken) throw new Error("You are not authenticated. Please login");

    let asyncToken;
    if (jtoken && jtoken.startsWith("Bearer")) {
      asyncToken = await util.promisify(jwt.verify)(
        jtoken.split(" ")[1],
        process.env.S_KEY
      );
    }

    const authorized = req.user && asyncToken && asyncToken.id === req.user._id;
    if (!authorized) {
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
    const user = await User.findOne({ email });
    if (!user) throw new Error("User email/password incorrect");
    const token = tokenGen({ name: user.name, id: user._id });
    res.status(200).json({ user, token });
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
