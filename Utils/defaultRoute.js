module.exports = defaultRoute = (req, res, next) => {
  res.status(400).json({
    status: "Failed",
    message: `Resource '${req.baseUrl}', not found`,
  });
};
