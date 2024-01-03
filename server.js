require("dotenv").config();
const connect = require("./Utils/dbConnection"),
  app = require("./app"),
  PORT = process.env.PORT || 5000;

app.listen(PORT, function (error) {
  if (error) console.log(err);
  console.info(`Server started successfully:, ${process.env.SERVER_URL}`);
});

connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
