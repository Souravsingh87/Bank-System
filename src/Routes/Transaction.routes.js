// const {Routes} = require("express");
// const authMiddleware = require("../Middleware/Auth.middleware"); // auth middleware ko import karenge, jisme humne user authentication ke liye logic likha hai, jisse hum user ko authenticate kar sakte hain aur unke access ko control kar sakte hain
// //const transactionController= require("../Controllers/Transaction.controller"); // transaction controller ko import karenge, jisme humne transaction se related logic likha hai, jisse hum transactions create kar sakte hain, transactions ki details dekh sakte hain, etc.
// const { createTransactionController } = require('../Controllers/Transaction.controller');

// const Router = require("express").Router; // express router ko import karenge, jisse hum apne routes ko organize kar sakte hain, aur unhe modular bana sakte hain

// const transactionRoutes = Router();

// // post /api/transaction/
// //create a new transaction 

// transactionRoutes.post("/",authMiddleware.authMiddleware, createTransactionController); // is route pe request aane se pehle auth middleware ko call karenge, jisse hum user ko authenticate kar sakte hain, agar user authenticated hai to next middleware ya controller ko call karenge, agar user authenticated nahi hai to error response bhejenge

// module.exports = transactionRoutes; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is route ko dusre files me import kar sakte hain. aap.js mai require karyenge

// const { Router } = require('express');
// const authMiddleware = require('../middleware/auth.middleware');
// const transactionController = require("../controllers/transaction.controller")

// const transactionRoutes = Router();

// /**
//  * - POST /api/transactions/
//  * - Create a new transaction
//  */

// transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)


// /**
//  * - POST /api/transactions/system/initial-funds
//  * - Create initial funds transaction from system user
//  */
// transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

// module.exports = transactionRoutes; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is route ko dusre files me import kar sakte hain. aap.js mai require karyenge

// const { Router } = require('express');
// // Folder name 'Middleware' (Uppercase M) check karein
// const authMiddleware = require('../Middleware/Auth.middleware');
// const transactionController = require("../Controllers/Transaction.controller");

// const transactionRoutes = Router();

// // Create a new transaction
// transactionRoutes.post("/", 
//     authMiddleware.authMiddleware, 
//     transactionController.createTransactionController // Aapke pehle screenshot mein naam 'createTransactionController' tha
// );

// // Create initial funds
// transactionRoutes.post("/system/initial-funds", 
//     authMiddleware.authSystemUserMiddleware, 
//     transactionController.createInitialFundsTransaction
// );

// module.exports = transactionRoutes; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is route ko dusre files me import kar sakte hain. aap.js mai require karyenge

const express = require("express");
// 1. Destructuring use karein taaki sahi function mile
const { authMiddleware, authSystemUserMiddleware } = require("../Middleware/Auth.middleware");
const { createTransactionController } = require('../Controllers/Transaction.controller');

const transactionRoutes = express.Router();

/**
 * POST /api/transaction/
 * Create a new transaction
 */
// 2. Ab yahan directly function name use karein
transactionRoutes.post("/", authMiddleware, createTransactionController); 

/**
 * POST /api/transactions/system/initial-funds
 */
// 3. System user ke liye system middleware use karein
transactionRoutes.post("/system/initial-funds", authSystemUserMiddleware, createTransactionController);

module.exports = transactionRoutes; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is route ko dusre files me import kar sakte hain. aap.js mai require karyenge