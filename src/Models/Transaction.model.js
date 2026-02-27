const mongoose = require("mongoose");

const tranctionSchema = new mongoose.Schema({
    fromAccountID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"fromAccountID is required for creating a transaction"],
        index:true
    },
    toAccountID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"toAccountID is required for creating a transaction"],
        index:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:{
        values:["pending","completed","failed","reversed"],
        message:"status must be either pending,completed,failed or reversed",
        default:"pending"    
        }
    
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
        min:[0,"transaction amount cannot be negative "],
    },
    idempotencyKey:{ //same payment karne se rokte hai , hamesha clint side pe generte karyega ,kabhi bhi idempotenkey repeat nhi hona chiye 
        type:String ,
        required:[true,"idempotencyKey is required for creating a transaction"],
        index:true,
        Unique:true 


    }
},{
    timestamps:true
})

const TransactionModel = mongoose.model("Transaction",tranctionSchema);

module.exports = TransactionModel; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is model ko dusre files me import kar sakte hain. aap.js mai require karyenge    