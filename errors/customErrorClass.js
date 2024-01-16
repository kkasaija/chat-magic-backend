class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code ? code : 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
