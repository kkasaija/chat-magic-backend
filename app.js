const express = require("express");
const cors = require("cors");
const userRouter = require("./Routes/userRouter");
const authRouter = require("./Routes/authRouter");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

module.exports = app;
