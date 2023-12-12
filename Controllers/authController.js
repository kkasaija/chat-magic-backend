const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");

const tokenGen = (payload) => {
  return jwt.sign(payload, process.env.S_KEY, {
    expiresIn: process.env.MAX_AGE,
  });
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("Bad request");
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
