// const jwt = require("jsonwebtoken"); // 

// const { JsonWebTokenError } = require("jsonwebtoken");
// const userModel = require("../Models/user.Model"); // user model ko import karenge, jisme humne user ka schema banaya hai, jisse hum database me user create kar sakte hain, user details fetch kar sakte hain, etc.    



// async function authMiddleware(req,res,next){
//     const token = req.cookies.token; // request cookies se token ko get karenge, jisme humne login ke time token set kiya tha

//     if(!token){
//         return res.status(401).json({
//             status:"failed",
//             message:"Unauthorized, please login to access this resource"
//         });
//     }       

//    try {

//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // token ko verify karenge, agar token valid hai to decoded me payload aayega, agar token invalid hai to error throw hoga

//     const user = await userModel.findById(decoded.userId); // decoded me se userID ko get karenge, aur user model se user ko find karenge, agar user milta hai to user me aayega, agar nahi milta hai to user null hoga

// req.user = user; // request object me user ko set karenge, jisse hum next middleware ya controller me use kar sakte hain

// next(); // next middleware ya controller ko call karenge    

//    }catch (error) {
    
//         return res.status(401).json({
//             status:"failed",
//             message:"Invalid token, please login again"
//         });
//     }   
// }




// module.exports = authMiddleware; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is middleware ko dusre files me import kar sakte hain. aap.js mai require karyenge     

// const jwt = require("jsonwebtoken"); // FIX 1: Added missing import
// const userModel = require("../Models/user.Model");

// async function authMiddleware(req, res, next) {
//     // FIX 2: Check BOTH cookies and Authorization headers for Postman compatibility
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({
//             status: "failed",
//             message: "Unauthorized, please login to access this resource"
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // FIX 3: Changed userID to userId to match your Controller's payload
//         const user = await userModel.findById(decoded.userId);

//         if (!user) {
//             return res.status(401).json({
//                 status: "failed",
//                 message: "User not found"
//             });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             status: "failed",
//             message: "Invalid token, please login again"
//         });
//     }
// }

// module.exports = authMiddleware;
// const jwt = require("jsonwebtoken"); // FIX: Added missing import
// const userModel = require("../Models/user.Model");

// async function authMiddleware(req, res, next) {
//     // FIX: Extract token from BOTH Cookies and Authorization Headers for Postman
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]; 

//     if (!token) {
//         return res.status(401).json({
//             status: "failed",
//             message: "Unauthorized, please login to access this resource"
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // FIX: Use 'userId' (lowercase 'd') to match the key used in userLoginController
//         const user = await userModel.findById(decoded.userId); 

//         if (!user) {
//             return res.status(401).json({
//                 status: "failed",
//                 message: "User not found"
//             });
//         }

//         req.user = user; 
//         next(); 

//     } catch (error) {
//         return res.status(401).json({
//             status: "failed",
//             message: "Invalid token, please login again"
//         });
//     }
// }


// module.exports = authMiddleware;



const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
//const tokenBlackListModel = require("../models/blackList.model")



async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)

        req.user = user

        return next()

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}
async function authSystemUserMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })
        }

        req.user = user

        return next()
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }

}
async function authSystemUserMiddleware(req,res,next){
    const token = req.cookies.token|| req.headers.authorization?.split(" ")[1]

    if (!token){
        return res.status(401).json({
            message:"Unauthorized access, token is missing"
        })
    }   
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user.systemUser){
            return res.status(403).json({
                message:"Forbidden access, not a system user"
            })
        }
        req.user=user
        return next()
    }
    catch(err){
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"

        })
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}