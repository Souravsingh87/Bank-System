// const accountModel = require("../Models/Account.model"); // account model ko import karenge, jisme humne account ka schema banaya hai, jisse hum database me account create kar sakte hain, account details fetch kar sakte hain, et

// async function createAccountController(req,res){
//     const user= req.user; // auth middleware se user ko get karenge, jisse hum account create karte time userId set kar sakte hain

//   const account = await accountModel.create({
//     userId: user._id,// account create karyenge userId ko set karenge jisse hum account ko user se link kar skate hai 
//   })

//   res.status(202).json({
//     account 
//   })
// }
// async function getUserAccountController(req,res){
//   const Accounts= await accountModel.find({userId:req.user._id});
//   return res.status(200).json({
//     accounts:Accounts,
//   })
// }
// async function getAccountBalanceController(req,res){
//   const {accountID}= req.params;

//   const account = await accountModel.findOne({
//     _id:accountID,
//     userId:req.user._id
//   });
//   if(!account){
//     return res.status(404).json({
//       message:"Account not found"
//     })
//   }
//   const balance = await account.getBalance();

//   return res.status(200).json({
//     balance:balance 
//   })
// }

// module.exports ={
//     createAccountController,
//     getUserAccountsController,
//     getAccountBalanceController
// }


// const accountModel = require("../Models/Account.model");

// async function createAccountController(req, res) {
//   const user = req.user; 
//   const account = await accountModel.create({
//     userId: user._id,
//   });

//   res.status(202).json({
//     account 
//   });
// }

// async function getUserAccountsController(req, res) {
//   const Accounts = await accountModel.find({ userId: req.user._id });
//   return res.status(200).json({
//     accounts: Accounts,
//   });
// }

// async function getAccountBalanceController(req, res) {
//   const { accountID } = req.params;

//   const account = await accountModel.findOne({
//     _id: accountID,
//     userId: req.user._id
//   });

//   if (!account) {
//     return res.status(404).json({
//       message: "Account not found"
//     });
//   }
  
//   const balance = await account.getBalance();

//   return res.status(200).json({
//     balance: balance 
//   });
// }

// module.exports = {
//     createAccountController,
//     getUserAccountsController,
//     getAccountBalanceController
// };
const accountModel = require("../Models/Account.model");

async function createAccountController(req, res) {
  const user = req.user;
  const account = await accountModel.create({
    userId: user._id,
  });
  res.status(202).json({
    account
  });
}

async function getUserAccountsController(req, res) {
  const Accounts = await accountModel.find({ userId: req.user._id });
  return res.status(200).json({
    accounts: Accounts,
  });
}

async function getAccountBalanceController(req, res) {
  const { accountID } = req.params;
  const account = await accountModel.findOne({
    _id: accountID,
    userId: req.user._id
  });
  if (!account) {
    return res.status(404).json({
      message: "Account not found"
    });
  }
  const balance = await account.getBalance();
  return res.status(200).json({
    balance: balance
  });
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController
};