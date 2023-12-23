require("dotenv").config();
const supertest = require("supertest"),
  app = require("../app"),
  request = supertest(app),
  User = require("./../Models/userModel"),
  dbName = require("../setup/setup");

dbName("my_tests");

describe("\nUSER QUERIES", () => {
  describe("\nGET ALL USERS: ", () => {
    it("Should return an array of users. ", async () => {
      const res = await request.get("/api/users");
      expect(res.statusCode).toBe(200);
    });
  });
});
