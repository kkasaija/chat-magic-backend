//In this file i define conditions for test

const mongoose = require("mongoose");

module.exports = function (database) {
  //beforeAll runs only once
  //before all tests, connect to database
  beforeAll(async () => {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`);
  });

  //return an object containing all connections
  const collections = mongoose.connection.collections;

  //after each test
  afterEach(async () => {
    for (let name in collections) {
      await mongoose.connection.collections[name].deleteMany();
    }
  });

  //after all tests
  afterAll(async function () {
    for (let name in collections) {
      await mongoose.connection.collections[name].drop();
    }
    await mongoose.connection.close();
  });
};
