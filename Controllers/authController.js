const User = require("./../Models/userModel"),
  jwt = require("jsonwebtoken"),
  util = require("util"),
  CustomError = require("../errors/customErrorClass"),
  { threeParamsAsyncHandler } = require("../errors/asyncHandler");

exports.isOwner = (req, res, next) => {
  //The 'credentials', and 'user' objects are defined in the 'protect' middleware function
  const credentials = req.credentials,
    user = req.user,
    owner = user && credentials && credentials.id === user._id;

  if (!owner) {
    next(
      new CustomError(
        "You are not authorized to perform this action. Only profile owners can update/ delete",
        401
      )
    );
  }

  next();
};

exports.signIn = threeParamsAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password are provided
  if (!email || !password)
    return next(
      new CustomError("Email and password are required for signing in", 400)
    );

  const user = await User.findOne({ email });
  if (!user) return next(new CustomError("User not registered", 400));
  //check if email/ password matched

  if (!(await user.isAuthentic(password)))
    return next(new CustomError("User email/password incorrect", 400));

  //if all conditions matched, generate toten and render user
  const token = user.generateJWToken();

  user.password = undefined;

  //create a cookie definition based on app environment
  let cookieOptions = {
    maxAge: 1000 * 60 * 4, // would expire in 20minutes
    httpOnly: true, //can only be accessed by server requests
    secure: true, // secure = true means send cookie over https
    sameSite: "none",
    partitioned: true,
  };

  res
    .cookie("token", token, cookieOptions) // set the token to respons header, so that the client sends it back on each subsequent request
    .status(200)
    .json({
      status: "Success",
      message: "You have successfully logged in",
      loggedIn: true,
    });

  next();
});

exports.signOut = (req, res) => {
  res.clearCookie("token").status(200).json({
    status: "Success",
    message: "Successfully logged out 😏 🍀",
  });
};

exports.register = threeParamsAsyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: "Success",
    user: newUser,
  });

  next();
});

exports.protect = threeParamsAsyncHandler(async (req, res, next) => {
  //check if token exists
  let token = req.cookies.token ? req.cookies.token : null;
  if (!token)
    return next(
      new CustomError("You are not authenticated. Please login", 401)
    );

  //validate the received token
  //for jwt stored in a cookie named token
  token = await util.promisify(jwt.verify)(token, process.env.S_KEY);

  //check if user exists
  const user = await User.findById(token.id).select("-password");
  if (!user) return next(new CustomError("The user does not exist", 400));

  //check if user changed password after issuance of token (i.e after login)
  if (await user.isUserUpdated(token.iat)) {
    return res.clearCookie("token").json({
      status: "Success",
      message:
        "Your User Profile was recently updated and you have been logged out. Please login again",
    });
  }

  //Add decoded token to req object
  req.credentials = token;

  //add user details to request object
  req.user;

  next();
});

//check if user is logged in when app starts(front end)
exports.loggedIn = threeParamsAsyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.token;
  if (!token) return res.json(false);
  token = await util.promisify(jwt.verify)(token, process.env.S_KEY);
  if (await User.findById(token.id)) return res.json(true);

  next();
});
