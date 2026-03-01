// const userModel = require("../Models/user.Model"); // M capital rakhein
// const jwt = require("jsonwebtoken"); // Spelling sahi karein
// const tokenBlackListModel = require("../Models/blackList.model"); // model.js add karein

 const userModel = require("../Models/user.Model"); // M capital as per Explorer
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../Models/blacklist.model"); // Match sidebar exactly

// const userModel = require("../models/user.model")
// const jwt = require("jsonwebtoken")
// //const tokenBlackListModel = require("../Models/blackList.model")
// //const tokenBlackListModel = require("../Models/blackList.js");
// const tokenBlackListModel = require("../Models/blackList.model");

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