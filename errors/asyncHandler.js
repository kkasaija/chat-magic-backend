exports.threeParamsAsyncHandler = (callBack) => {
  return (req, res, next) => {
    callBack(req, res, next).catch((error) => next(error));
  };
};

exports.fourParamsAsyncHandler = (callBack) => {
  return (req, res, next, id) => {
    callBack(req, res, next, id).catch((error) => next(error));
  };
};
