function getErrorMessage(error) {
  let result;

  try {
    for (property in error.keyValue) {
      result = `${property.charAt(0).toUpperCase() + property.slice(1)}: '${
        error.keyValue[property]
      }', alreday exists. try signing instead`;
    }
  } catch (error) {
    result = "Unique field already exists";
  }
  //add statusCode property to the error object
  error.statusCode = 400;
  return result;
}

module.exports = (error, res) => {
  let message = {};
  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = getErrorMessage(error);
        break;
      default:
        message = "Something went wrong, contact the systems administrator";
        break;
    }
  } else if (error.errors) {
    for (errorName in error.errors) {
      //add key value pairs to the message object
      message[errorName] = error.errors[errorName].message;
    }
  } else {
    message = error.message;
  }
  res.status(error.statusCode).json({ error: message });
};
