let express = require("express"),
  cors = require("cors"),
  cookieParser = require("cookie-parser"),
  morgan = require("morgan"),
  userRouter = require("./Routes/userRouter"),
  authRouter = require("./Routes/authRouter"),
  defaultRoute = require("./Utils/defaultRoute"),
  app = express(),
  corsOptions;

if (process.env.NODE_ENV === "development") {
  corsOptions = {
    origin: ["http://localhost:5173"], //frontend app server
    credentials: true, //access-control-allow-credentials:true
  };
}

if (process.env.NODE_ENV === "production") {
  corsOptions = {
    origin: [""], //frontend app server e.g "https://xyz.onrender.com"
    credentials: true, //access-control-allow-credentials:true
  };
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use("*", defaultRoute);

module.exports = app;
