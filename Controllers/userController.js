const User = require("./../Models/userModel");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "Success",
      users,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.checkId = async (req, res, next, id) => {
  try {
    const user = await User.findOne({ _id: id });
    if (!user) throw new Error("No such user exists");
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUser = (req, res) => {
  const user = req.user;
  req.user.password = undefined;
  res.json({ user });
};

exports.updateUser = async (req, res) => {
  Object.assign(req.user, req.body);
  await req.user.save({ validateBeforeSave: false });
  req.user.password = undefined;
  res.json({ user: req.user });
};

exports.deleteUser = async (req, res) => {
  const user = req.user;
  await user.deleteOne();
  res.json({ status: "Success" });
};
