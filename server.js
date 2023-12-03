require("dotenv").config();
const dbConnection = require("./Utils/dbConnection");
const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, function (error) {
  if (error) console.log(err);
  console.info("Server started successfully on port:", PORT);
});

dbConnection(process.env.BD_URL);
