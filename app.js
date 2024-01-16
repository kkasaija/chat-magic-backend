const express = require("express"),
  cors = require("cors"),
  cookieParser = require("cookie-parser"),
  morgan = require("morgan"),
  userRouter = require("./Routes/userRouter"),
  authRouter = require("./Routes/authRouter"),
  defaultRoute = require("./Utils/defaultRoute"),
  globalErrorHandler = require("./Controllers/errorController"),
  app = express(),
  corsOptions = {
    origin: "http://localhost:5173", //frontend app server
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use("*", defaultRoute);
app.use(globalErrorHandler)

module.exports = app;
