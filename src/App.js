
const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./Routes/Auth.routes");
const accountRoutes = require("./Routes/Account.routes");
const transactionRoutes= require("./Routes/Transaction.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);

module.exports = app;