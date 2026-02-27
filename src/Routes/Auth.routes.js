const express = require("express")
//const authController = require("../controller/auth.controller")
const authController = require("../Controllers/Auth.controller"); // auth controller ko import karenge, jisme humne user registration aur login ke liye logic likha hai, jisse hum user ko register kar sakte hain aur login kar sakte hain

const router = express.Router()


/* POST /api/auth/register */
router.post("/register", authController.userRegisterController)


/* POST /api/auth/login */
router.post("/login",authController.userLoginController)

/**
 * - POST /api/auth/logout
 */
router.post("/logout", authController.userLogoutController)



module.exports = router