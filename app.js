const express = require("express"),
  cors = require("cors"),
  cookieParser = require("cookie-parser"),
  morgan = require("morgan"),
  userRouter = require("./Routes/userRouter"),
  authRouter = require("./Routes/authRouter"),
  app = express();

app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

module.exports = app;
