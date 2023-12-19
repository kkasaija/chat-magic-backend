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

  try {
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
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    user.save({ validateBeforeSave: false });
    throw new Error(
      `There was an error sending a password reset email. Please try again later`
    );
  }

  next();
};

exports.resetPassword = async (req, res, next) => {
  const { user_id, token } = req.params,
    now = new Date().getTime(),
    user = await User.findById({ user_id });

  //check if user with given token exists
  if (!user) throw new Error("User doesn't exist");

  const passed = await user.verifyResetToken(token, new Date());
  //check if token expired or password already been reset
  if (!passed) {
    throw new Error(
      "Invalid link. Password may have already been reset or link expired"
    );
  }

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
};
