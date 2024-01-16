const CustomError = require("../errors/customErrorClass");

module.exports = defaultRoute = (req, res, next) => {
  next(new CustomError(`Resource ${req.originalUrl} not found`), 404);
};
