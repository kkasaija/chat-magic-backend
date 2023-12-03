const mongoose = require("mongoose");

const connect = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Successfully connected to database");
  } catch (error) {
    console.log("Database connection failed");
  }
};

module.exports = connect;
