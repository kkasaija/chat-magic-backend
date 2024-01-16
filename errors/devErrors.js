module.exports = (error, res) => {
  res.status(error.statusCode).json({
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};
