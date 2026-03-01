
// const express = require("express")
// //const authMiddleware = require("../middleware/auth.middleware")
// const authMiddleware = require('../Middleware/auth.middleware');

// const accountController = require("../controllers/account.controller")


// const router = express.Router()



// /**
//  * - POST /api/accounts/
//  * - Create a new account
//  * - Protected Route
//  */
// router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)


// /**
//  * - GET /api/accounts/
//  * - Get all accounts of the logged-in user
//  * - Protected Route
//  */
// router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController)


// /**
//  * - GET /api/accounts/balance/:accountId
//  */
// router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)



// module.exports = router
// const express = require("express");
// const authMiddleware = require("../Middleware/auth.middleware"); // Import path
// const accountController = require("../Controllers/Account.controller"); // Import path

// const router = express.Router();

// /**
//  * POST /api/accounts/
//  * Create a new account
//  */
// router.post("/", authMiddleware, accountController.createAccountController); 

// /**
//  * GET /api/accounts/
//  * Get all accounts of logged-in user
//  */
// router.get("/", authMiddleware, accountController.getUserAccountsController);

// /**
//  * GET /api/accounts/balance/:accountId
//  */
// router.get("/balance/:accountId", authMiddleware, accountController.getAccountBalanceController);

// module.exports = router;
const express = require("express");
const authMiddleware = require("../Middleware/auth.middleware");
const accountController = require("../Controllers/Account.controller");

const router = express.Router();

router.post("/", authMiddleware, accountController.createAccountController);
router.get("/", authMiddleware, accountController.getUserAccountsController);
router.get("/balance/:accountId", authMiddleware, accountController.getAccountBalanceController);

module.exports = router;