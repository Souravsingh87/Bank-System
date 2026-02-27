const mongoose = require("mongoose");
//yah page mai humlog apna transation id ka entry rakhyenge 

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"ledger must be associate with account "],
        index:true,  
        immutable:true // ledger create hone ke baad account field ko update nahi kar sakte hain 
    },
    amount:{
        type:Number,
        required:[true,"amount is required for creating a ledger entry"],
        immutable:true // ledger create hone ke baad amount field ko update nahi kar sakte hain
    },
transactionID:{ // har ledger entry ke sath ek transaction id bhi associate karenge, jisse hum pata kar sakte hain ki ye ledger entry kis transaction se related ha
type:mongoose.Schema.Types.ObjectId,
ref:"transaction",
required:[true,"transactionID is required for creating a ledger entry"],
index:true,
immutable:true // ledger create hone ke baad transactionID field ko update nahi kar sakte hain      
    }
},{
    type:{
        type:String,
        enum:{
            values:["debit","credit"],
            message:"ledger type must be either debit or credit"
        },
        required:[true,"ledger type is required for creating a ledger entry"],
        immutable:true // ledger create hone ke baad type field ko update nahi kar sakte hain         

    }
})

function preventledgerModification(){
    throw new Error("Ledger entries cannot be modified or deleted")
}

ledgerSchema.pre("findOneAndUpdate",preventledgerModification); // findOneAndUpdate ke time preventledgerModification function ko call karenge, jisse ledger entries ko modify karne se roka ja sake
ledgerSchema.pre("updateOne",preventledgerModification); // updateOne ke time preventledgerModification function ko call karenge, jisse ledger entries ko modify karne se roka ja sake  

ledgerSchema.pre("deleteOne",preventledgerModification); // deleteOne ke time preventledgerModification function ko call karenge, jisse ledger entries ko delete karne se roka ja sake          
ledgerSchema.pre("remove",preventledgerModification); // remove ke time preventledgerModification function ko call karenge, jisse ledger entries ko delete karne se roka ja sake        
ledgerSchema.pre("findOneAndDelete",preventledgerModification); // findOneAndDelete ke time preventledgerModification function ko call karenge, jisse ledger entries ko delete karne se roka ja sake          
ledgerSchema.pre("updateMany",preventledgerModification); // updateMany ke time preventledgerModification function ko call karenge, jisse ledger entries ko modify karne se roka ja sake            
ledgerSchema.pre("findOneAndDelete",preventledgerModification); // findOneAndDelete ke time preventledgerModification function ko call karenge, jisse ledger entries ko delete karne se roka ja sake    
ledgerSchema.pre("findOneAndReplace",preventledgerModification); // findOneAndReplace ke time preventledgerModification function ko call karenge, jisse ledger entries ko modify karne se roka ja sake  

const LedgerModel = mongoose.model("Ledger",ledgerSchema);

module.exports = LedgerModel; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is model ko dusre files me import kar sakte hain. aap.js mai require karyenge 
