const TransactionModel = require("../Models/Transaction.model");    
const ledgerModel = require("../Models/Ledger.model");  
const AccountModel = require("../Models/Account.model");    
const emailService = require("../services/email.service");  
const mongoose = require("mongoose")


// validate request 
// incoming data check krte hai shi hai ya phir galt hai check krte hai 

async function createTransactionController(req,res){
const {fromAccountID,toAccountID,amount,idempotencyKey} =req.body;

if (!fromAccountID || !toAccountID || !amount || !idempotencyKey){
     return res.status(400).json({
        message:"fromAccountID, toAccountID, amount and idempotencyKey are required for creating a transaction" 

    })
}
const fromAccount = await AccountModel.findOne({
    _id:fromAccountID,
})
if  (!fromAccount){
    return res.status(404).json({
        message:"fromAccountID or toAccountId is invalid, account not found"
    })
}


// //const toAccount = await AccountModel.findOne({
//     _id:toAccountID,
// })
// if  (!toAccount){
//     return res.status(404).json({
//         message:"toAccountId is invalid, account not found"
//     })
// }
// validate idempotencyKey, same key se do bar transaction nhi hoga
// idempotency key se hum ensure karte hai ki same transaction do bar execute na ho, agar client se same idempotency key ke sath request aati hai to hum us transaction ko repeat nahi karenge, isse hum duplicate transactions se bach sakte hain. 
const ifTransactionExists=await TransactionModel.findOne({
    idempotencyKey:idempotencyKey 
})
if (ifTransactionExists){
    if (ifTransactionExists.status==="completed"){
        return res.status(200).json({
            message:"Transaction already processed",
            transaction:ifTransactionExists
        })  
    }
    if (ifTransactionExists.status==="pending"){
        return res.status(200).json({
            message:"Transaction is still pending, please wait",
            transaction:ifTransactionExists
        })  
    }   
    if (ifTransactionExists.status==="failed"){
        return res.status(200).json({
            message:"Transaction already failed, please try again with a different idempotency key",
            transaction:ifTransactionExists
        })  
    }      
    if (ifTransactionExists.status==="reversed"){       
        return res.status(200).json({
            message:"Transaction already reversed, please try again with a different idempotency key",
            transaction:ifTransactionExists
        })  
    }                            
} 
// check account status, agar account frozen ya closed hai to transaction nahi hoga
 if (fromAccount.status!=="Active"||toUserAccount.status!=="Active"){
    return res.status(400).json({
        message:"Either fromAccount or toAccount is not active, transaction cannot be processed"
    })
 }  

 // 4- derive sender balance from ledger, ledger me se fromAccountID ke sare transactions ko find karenge, aur un transactions ke amount ko add karenge, jisse hume sender ka current balance mil jayega, isme hum completed transactions ko consider karenge, pending transactions ko consider nahi karenge kyunki wo abhi process ho rahe hai, failed transactions ko consider nahi karenge kyunki wo complete nahi hue hai, reversed transactions ko consider nahi karenge kyunki wo reverse ho chuke hai.
 const balance = await fromAccount.getBalance();    // getBalance method ko call karenge, jisme hum ledger me se fromAccountID ke sare transactions ko find karenge, aur un transactions ke amount ko add karenge, jisse hume sender ka current balance mil jayega
if (balance<amount){
    return res.status(400).json({
        message:`insuffcent balance.current balance is ${balance}.request amount is ${amount}`
    })
}

//5th create transaction (pending) 

const session = await mongoose.startSession()
session.startTransaction()

const transaction = await TransactionModel.create({
    fromAccountID,
    toAccountID,
    amount,
    idempotencykey,
    status:"pending"
},{session})

const debitLedgerEntry = await ledgerModel.create({
    accountID:fromAccountID,
    amount:amount,
    transactionID:transaction._id,
    type:"debit",
},{session})    
 
const creditLedgerEntry = await ledgerModel.create({
    accountID:toAccountID,
    amount:amount,
    transactionID:transaction._id,
    type:"credit",
},{session})        
 
transaction.status="completed";
await transaction.save({session})

await session.commitTransaction()
session.endSession()

// send email notification to sender and receiver, email service ka use karenge, jisme humne email bhejne ke liye logic likha hai, isme hum sender aur receiver ko email bhejenge, jisme transaction details hongi, jaise amount, fromAccountID, toAccountID, transaction status, etc.  

await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,fromAccountID,toAccountID,transaction.status) // email service ke sendTransactionEmail method ko call karenge, jisme hum sender ke email, sender ke name, amount, fromAccountID, toAccountID, transaction status ko pass karenge, jisse email me ye details include ho jayengi.  
 return res.status(201).json({
    message:"Transaction completed successfully",
    transaction:transaction
 })

}

async function creatingInitialFundsTransaction(req,res){
    const {toAccountID,amount,idempotencyKey} = req.body;
    if (!toAccountID || !amount ||!idempotencyKey){
        return res.status(400).json({
            message:"toAccountID, amount and idempotencyKey are requires for creating initial fund transaction"

        })
    }
    const toUserAccount = await AccountModel.findOne({
        _id:toAccountID,

    })
    if(!toUserAccount){
        return res.status(404).json({
            message:"toAccountID is invalid, account not found"
        })
    }
    fromUserAccount = await AccountModel.findOne({
        ///
        user:req.user._id
    })
    if(!fromUserAccount){
        return res.status(404).json({
            message:"system account not found, contact support"
        })
    }
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new TransactionModel({
        fromAccountID:fromUserAccount._id,
        toAccountID:toUserAccount._id,
        amount,
        idempotencyKey,
        status:"pending"
    })
 
    const debitLedgerEntry = await ledgerModel.create([{
        accountID:fromUserAccount._id,
        amount,
        transactionID:transaction._id,
        type:"DEBIT",
    }],{session})    

    const creditLedgerEntry = await LedgerModel.create([{
        accountID:toUserAccount._id,
        amount,
        transactionID:transaction._id,
        type:"CREDIT",
    }],{session})
    transaction.status="completed";
    await transaction.save({session})
    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"initial fund transaction completed successfully",
        transaction:transaction
    })
    
}

// module.exports={
//     createTransaction
// }
module.exports = {
    createTransaction,
     createTransactionController,
     
    
};