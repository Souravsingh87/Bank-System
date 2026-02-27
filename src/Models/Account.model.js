const mongoose = require("mongoose"); // mongoose library ko import karna
const  ledgerModel= require("./Ledger.model"); // ledger model ko import karna, jisme humne ledger ke liye schema banaya hai, jisse hum ledger entries ko create kar sakte hain aur manage kar sakte hain
const { $where } = require("./user.Model");

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required for creating an account"],
    index:true // userId field pe index create karenge, jisse queries fast ho jayengi 
  },

 status:{
    type:String,
    enum:{
        values:["active","frozen","closed"],
        message:"status must be either active, frozen or closed",
        ///default:"active"
    },
    default:"active"
 },
 currency:{
    type:String,
    required:[true,"currency is required for creating an account"],
    default:"INR"
 },

    
},{
    timestamps:true // createdAt aur updatedAt fields ko automatically add kar dega 

});

accountSchema.index({ userId: 1 , status:1 }); // userId field pe index create karenge, jisse queries fast ho jayengi  

// accountSchema.methods.getBalance = async function (){
//   const balanceData = await ledgerModel.aggregate([ 
//     {
//       $match: {
//         accountID: this._id,
//         status: "completed"
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         totalDebit: {
//            $sum: {
//             $cond: [
//               { $eq: ["$type", "debit"] },
//               "$amount",
//               0
//            ]
//            }
//       }
//       totalCredit: {
//         $sum: {
//           $cond: [  
//             { $eq: ["$type", "credit"] },
//             "$amount",
//             0
//           ]
//         }
//       }  
//       {
//           $project: { 
//             _id: 0,
//             balance: { $subtract: ["$totalCredit", "$totalDebit"] }
//           }
//       } 
//     }
//   ]); // ledger collection me aggregate query run karenge, jisme hum accountID ke basis pe ledger entries ko match karenge, aur un entries ko group karenge, jisme hum total debit aur total credit ko calculate karenge, aur finally balance ko calculate karenge by subtracting total debit from total credit. isme hum sirf completed transactions ko consider karenge, kyunki pending ya failed transactions ka balance pe effect nahi hota hai.  
//   if (balanceData.length === 0) {
//     return 0; // agar koi ledger entry nahi hai to balance 0 hoga
//   }
//   return balanceData[0].balance;
// }
accountSchema.methods.getBalance = async function () {

  const balanceData = await ledgerModel.aggregate([
    {
      $match: {
        account: this._id,
        status: "completed"
      }
    },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "debit"] },
              "$amount",
              0
            ]
          }
        },
        totalCredit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "credit"] },
              "$amount",
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] }
      }
    }
  ]);

  if (balanceData.length === 0) return 0;

  return balanceData[0].balance;
};


const AccountModel = mongoose.model("Account", accountSchema);

module.exports = AccountModel; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is model ko dusre files me import kar sakte hain. aap.js mai require karyenge