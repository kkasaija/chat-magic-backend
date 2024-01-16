const devErrors = require("../errors/devErrors");
prodErrors = require("../errors/prodErrors");

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode ? error.statusCode : 500;
  switch (process.env.NODE_ENV.trim()) {
    case "production":
      prodErrors(error, res);
      break;
    case "development":
      devErrors(error, res);
      break;
    default:
      res.status(500).json({
        message: "Something went wrong",
      });
      break;
  }
  next();
};
