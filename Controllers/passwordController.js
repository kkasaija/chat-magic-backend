const User = require("../Models/userModel"),
  sendEmail = require("./../Utils/sendEmail"),
  generateEmail = require("./../Utils/generateEmail"),
  CustomError = require("../errors/customErrorClass"),
  { threeParamsAsyncHandler } = require("../errors/asyncHandler");

//Handling forgotten passwords
exports.forgotPassword = threeParamsAsyncHandler(async (req, res, next) => {
  //1. get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new CustomError(
        "User does not exist. Please provide a Valid User Email",
        404
      )
    );
  //2. generate random password reset token
  const resetToken = await user.generatePasswordResetToken();
  //save the generated token and token expiry time to database
  await user.save({ validateBeforeSave: false });
  //3. send token to user
  const resetUrl = `${req.protocol}://${req.get("host")}/api/users/${
    user._id
  }/resetPassword/${resetToken}`;

  const message = await generateEmail({
    name: user.name,
    resetLink: resetUrl,
  });

  await sendEmail({
    name: user.name,
    email: user.email,
    subject: "Password reset requested",
    message,
  });

  res.status(200).json({
    status: "Succeeded",
    message: `Password reset link sent to Email ${user.email}`,
    reseToken: resetToken,
  });

  next();
});

exports.resetPassword = threeParamsAsyncHandler(async (req, res, next) => {
  const { user_id, token } = req.params,
    user = await User.findById({ _id: user_id });
  //check if user with given token exists
  if (!user) next(new CustomError("User doesn't exist", 400));
  if (!user.passwordResetToken)
    return next(
      new CustomError(
        "Password reset link has already been used and link expired",
        400
      )
    );
  const passed = await user.verifyResetToken(token, new Date());
  //check if token expired or password already been reset
  if (!passed) {
    return next(
      new CustomError(
        "Invalid link. Password may have already been reset or link expired",
        400
      )
    );
  }
  if (!req.body.password || !req.body.confirm_password)
    return next(
      new CustomError("No update parameters provided. Please try again", 400)
    );
  //reset user password
  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresIn = undefined;

  await user.save();

  res.status(200).json({
    status: "Succeeded",
    message: "Password changed successfully. you can go to login page",
  });

  next();
});
