const devErrors = require("../errors/devErrors");

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode ? error.statusCode : 500;
  switch (process.env.NODE_ENV) {
    case "production":
      break;
    case "development":
      devErrors(error, res);
    default:
      break;
  }
  next();
};

