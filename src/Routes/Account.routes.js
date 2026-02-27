const express = require("express");

const authMiddleware = require("../Middleware/Auth.middleware"); // auth middleware ko import karenge, jisme humne user authentication ke liye logic likha hai, jisse hum user ko authenticate kar sakte hain aur protected routes bana sakte hain

const accountController = require("../Controllers/Account.controller");

const router = express.Router();

//post /api/accounts/create a new account 
//protected route, user ko authenticate karna hoga is route pe access karne ke liye

router.post("/", authMiddleware, accountController.createAccountController);


//api/accounts/:accountID get account details by accountID
//get accout of logged in user by accountID, protected route, user ko authenticate karna hoga is route pe access karne ke liye
//protected routes

// api /blabla/accounts/123456789/account id
router.get("/balance/:accountID", authMiddleware, accountController.getUserAccountController);



module.exports = router; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is router ko dusre files me import kar sakte hain. aap.js mai require karyenge    