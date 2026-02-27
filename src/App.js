//const express = require('express');
//const cookieParser = require("cookie-parser"); // cookie parser ko import karenge, jisme hum cookies ko parse karenge

//const authRoutes = require("./Routes/Auth.routes"); // auth routes ko import karenge, jisme hum login aur register ke routes banayenge

//const AccountRoutes = require("./Routes/Account.routes"); // account routes ko import karenge, jisme hum account se related routes banayenge, jaise account create karna, account details lana, etc.    

//const app = express(); // express app banayenge

//app.use(express.json()); // express json middleware ko use karenge, request.body ka data ko nhi phar sakta hai wo itna capable nhi hota hai , wo padhsake isliye express.json ka use krte hai 

//app.use(cookieParser()); // cookie parser middleware ko use karenge, isse hum cookies ko parse kar sakte hain, isse hum cookies ko read kar sakte hain aur set kar sakte hain   

//app.use("/api/auth",authRoutes); // jab bhi /api/auth route pe request aayegi to authRoutes ko use karenge, isse humare auth routes /api/auth ke andar aa jayenge

//app.use("/api/accounts",AccountRoutes); // jab bhi /api/accounts route pe request aayegi to AccountRoutes ko use karenge, isse humare account routes /api/accounts ke andar aa jayenge

//module.exports=app; //isko export krne kliye humne module.exports ka use kiya hai, jisse hum is app ko dusre files me import kar sakte hain. 


//const authRoutes = require("./Routes/Auth.routes"); // auth routes ko import karenge, jisme hum login aur register ke routes banayenge


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