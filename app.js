const express = require("express"),
  cors = require("cors"),
  cookieParser = require("cookie-parser"),
  morgan = require("morgan"),
  userRouter = require("./Routes/userRouter"),
  authRouter = require("./Routes/authRouter"),
  app = express(),
  resetPasswordRouter = require("./Routes/resetRouter");

app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/resetPassword", resetPasswordRouter);

module.exports = app;
