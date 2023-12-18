const User = require("../Models/userModel"),
  sendEmail = require("./../Utils/sendEmail"),
  generateEmail = require("./../Utils/generateEmail");

//Handling forgotten passwords
exports.forgotPassword = async (req, res, next) => {
  //1. get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new Error("User does not exist. Please provide a Valid User Email");

  //2. generate random password reset token
  const resetToken = user.generatePasswordResetToken();

  //save the generated token and token expiry time to database
  await user.save({ validateBeforeSave: false });

  //3. send token to user
  const resetUrl = `${req.protocol}://${req.get("host")}/api/users/${
    user._id
  }/resetPassword/${resetToken}`;

  // const message = `We received a request from you to reset your password. Please use the link below to reset\n\n${resetUrl}\n\nThe link will be valid for only 10 minutes`;

  const message = generateEmail({
    name: user.name,
    resetLink: resetUrl,
  });

  try {
    await sendEmail({
      name: user.name,
      email: user.email,
      subject: "Password reset requested",
      message,
    });

    res.status(200).json({
      status: "Succeeded",
      message: "Password reset link sent to user Email",

      //sending this data for postman environment automation
      reseToken: resetToken,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    user.save({ validateBeforeSave: false });
    throw new Error(
      `There was an error sending a password reset email. Please try again later`
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  //check if user with given token exists
  const passed = await User.verifyResetToken(req.params.reseToken, new Date());

  //check if token expired or password already been reset
  if (!passed) {
    throw new Error(
      "Invalid link. Password may have already been reset or link expired"
    );
  }

  const user = await User.findOne({ passwordResetToken: req.params.reseToken });

  //reset user password
  user.password = req.body.password;
  user.confirm_password = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresIn = undefined;

  await user.save();

  res.status(200).json({
    status: "Succeeded",
    message: "Password changed successfully. you can go to login page",
  });
  next();
};
