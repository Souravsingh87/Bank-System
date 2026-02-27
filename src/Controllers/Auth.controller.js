// const userModel = require("../Models/user.Model"); // user model ko import karenge, jisme humne user schema banaya hai
// const jwt = require("jsonwebtoken"); // jsonwebtoken package ko import karenge, jisme hum token generate karenge aur verify karenge

// const emailService = require("../Services/Email.service"); // email service ko import karenge, jisme humne email bhejne ka logic likha hai, isse hum user ko registration ke time welcome email bhej sakte hain 


// //*
// //user register controller banayenge, jisme hum user ko register karenge 
// //-post./api/auth/register



//  async function userRegisterController(req,res){
//         const {name,email,password} = req.body; // request body se name, email aur password ko destructure karenge

// const isExists= await userModel.findOne ({
//     email:email
// }); // user model se email ke basis pe user ko find karenge, agar user milta hai to isExists me aayega, agar nahi milta hai to isExists null hoga

// if (isExists){
// return res.status(422).json({
//     status:"failed",
// message:"email already exists, please login instead"}) }


//     // User create karenge agar email exist nahi karta
//     const user = await userModel.create({
//         name, email, password
//     });

//     // Token generate karenge user ke id ko payload me daal kar, JWT_SECRET se sign karenge, aur token 1 day ke liye valid hoga
//     const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

//     // Token ko cookie me set karenge
//     res.cookie("token", token);

//     // Response bhejenge
//     res.status(201).json({
//         user: {
//             _id: user._id,
//             name: user.name,
//             email: user.email
//          },
//         token
//     });

//     await emailService.sendRegistrationEmail(user.email, user.name); // registration ke time welcome email bhejenge, isme hum user ke email aur name ko pass karenge, jisse email service me use karenge    
    
// }

// //- user login controller banayenge, jisme hum user ko login karenge
// //- post./api/auth/login

// async function userLoginController(req,res){
//     const {email,password} =req.body; // request body se email aur password ko destructure karenge

//     const user = await userModel.findOne({email}).select("+password"); // user model se email ke basis pe user ko find karenge, aur password field ko bhi select karenge kyunki by default password field select nahi hota hai 

//     if(!user){
//         return res.status(401).json({
//             message:"email or password in incorrect"
//         })
//     }

//     const isvalidPassword = await user.comparePassword(password); // user instance ke comparePassword method ko call karenge, jisme hum plain text password ko hashed password se compare karenge

//     if(!isvalidPassword){
//         return res.status(401).json({
//             message:"email or password in incorrect"
//         })
//     }

//     // Token generate karenge user ke id ko payload me daal kar, JWT_SECRET se sign karenge, aur token 1 day ke liye valid hoga
//     const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

//     // Token ko cookie me set karenge
//     res.cookie("token", token);

//     // Ye function aapne nahi likha tha, ise add karein
// async function userLogoutController(req, res) {
//     try {
//         res.clearCookie("token");
//         res.status(200).json({ message: "Logged out successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Logout failed" });
//     }
// }   

//     // Response bhejenge
//     res.status(200).json({
//         user: {
//             _id: user._id,
//             name: user.name,
//             email: user.email
//          },
//         token
//     });
// }

// module.exports = {
//     userRegisterController,
//     userLoginController,
//     userLogoutController    
// }; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is controller ko dusre files me import kar sakte hain. aap.js mai require karyenge


//const userModel = require("../models/user.model")
 const userModel = require("../Models/user.Model");
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
//const tokenBlackListModel = require("../models/blackList.model")

/**
* - user register controller
* - POST /api/auth/register
*/
async function userRegisterController(req, res) {
    const { email, password, name } = req.body

    const isExists = await userModel.findOne({
        email: email
    })

    if (isExists) {
        return res.status(422).json({
            message: "User already exists with email.",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email, user.name)
}

/**
 * - User Login Controller
 * - POST /api/auth/login
  */

async function userLoginController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

}


/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}