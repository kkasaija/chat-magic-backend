require("dotenv").config();
const supertest = require("supertest"),
  app = require("../app"),
  request = supertest(app),
  User = require("./../Models/userModel"),
  dbName = require("../setup/setup");

dbName("my_tests");

describe("POST: api/auth/users", () => {
  describe("Register User: ", () => {
    //save the name, email and password to the database
    //reply with a json object containing the user
    test("should respond with status code 200", async () => {
      const res = await request.post("/api/auth/register").send({
        name: "Kasaija Kenneth",
        email: "kasaijak79@gmail.com",
        password: "test1234",
        confirm_password: "test1234",
      });
      expect(res.statusCode).toBe(200);
    });
    //specify json as content type in the header
  });

  // describe("Mising a name, email or password", () => {
  //   //respond with status code 400
  // });
});

// it("Should return user registration status", async function () {
//   return supertest(app)
//     .post("/api/auth")
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .then((res) => {
//       expect(res.statusCode).toBe(200);
//     });
// });
