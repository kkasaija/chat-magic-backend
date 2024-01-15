require("dotenv").config();
const supertest = require("supertest"),
  app = require("../app"),
  request = supertest(app),
  User = require("./../Models/userModel"),
  dbName = require("../setup/setup");

dbName("my_tests");

describe("\nAUTHENTICATION CHECK TESTS (i.e Registration, and Signin)", () => {
  describe("\nREGISTER A USER: ", () => {
    describe("With name, email & password", () => {
      //save the name, email and password to the database
      //reply with a json object containing the user
      it("should be successful, statusCode 200", async () => {
        const res = await request.post("/api/auth/register").send({
          name: "Kasaija Kenneth",
          email: "kasaijak79@gmail.com",
          password: "test1234",
          confirm_password: "test1234",
        });
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(res.body.user).toEqual(
          expect.objectContaining({
            __v: 0,
            _id: expect.any(String),
            createdAt: expect.any(String),
            email: expect.any(String),
            name: expect.any(String),
            password: expect.any(String),
          })
        );
      });
    });

    describe("Missing either a name, email or password", () => {
      it("Should fail with status code 400", async () => {
        const res = await request.post("/api/auth/register");
        expect(res.statusCode).toEqual(400);
      });
    });
  });

  describe("\nSIGNIN A USER: ", () => {
    describe("With correct credentials", () => {
      it("Should be successful, status code 200", async () => {
        const res = await request.post("/api/auth/signin").send({
          email: "kasaijak79@gmail.com",
          password: "test1234",
        });
        expect(res.statusCode).toBe(200);
      });
    });

    describe("With incorrect/ missing credentials", () => {
      it("Should fail, status code 400", async () => {
        const res = await request.post("/api/auth/signin").send({});
        expect(res.statusCode).toBe(400);
        expect(res.error.message).toBeTruthy();
      });
    });
  });
});
