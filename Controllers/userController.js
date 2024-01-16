const User = require("./../Models/userModel"),
  CustomError = require("../errors/customErrorClass"),
  {
    threeParamsAsyncHandler,
    fourParamsAsyncHandler,
  } = require("../errors/asyncHandler");

exports.getUsers = threeParamsAsyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password");
  res.status(200).json({
    status: "Success",
    users,
  });

  next();
});

exports.checkId = fourParamsAsyncHandler(async (req, res, next, id) => {
  const user = await User.findOne({ _id: id });
  if (!user) return next(new CustomError("No such user exists", 400));
  req.user = user;

  next();
});

exports.getUser = (req, res) => {
  const user = req.user;
  req.user.password = undefined;
  res.json({ user });
};

exports.updateUser = threeParamsAsyncHandler(async (req, res, next) => {
  Object.assign(req.user, req.body);
  await req.user.save({ validateBeforeSave: false });
  req.user.password = undefined;
  res.json({ user: req.user });

  next();
});

exports.deleteUser = threeParamsAsyncHandler(async (req, res, next) => {
  const user = req.user;
  await user.deleteOne();
  res.json({ status: "Success" });

  next();
});
