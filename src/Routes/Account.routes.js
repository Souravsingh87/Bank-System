const express = require("express");
// Sabse upar 'authMiddleware' (chhoti 'a') se import kiya gaya hai
const authMiddleware = require("../Middleware/auth.middleware");
const accountController = require("../Controllers/account.controller");

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
// Yahan 'AuthMiddleware' (badi 'A') ki galti theek kar di gayi hai
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController);

/**
 * - GET /api/accounts/balance/:accountId
 */
// Yahan bhi 'authMiddleware' (chhoti 'a') ka use kiya gaya hai jo upar defined hai
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController);

module.exports = router;