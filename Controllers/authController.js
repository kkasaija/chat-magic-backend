const User = require("./../Models/userModel");

exports.signIn = async (req, res) => {};

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
