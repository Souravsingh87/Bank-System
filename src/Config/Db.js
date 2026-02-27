const mongoose = require("mongoose")



function connectTODB(){
    console.log('MONGO_URI from env:', process.env.MONGO_URI); // Debug: print the URI being used

    mongoose.connect(process.env.MONGO_URI) // ISKO CONNECT KRNE SE PHLE SEVER .JS MAI ENV FILE KO IMPORT KRKE USME SE MONGO_URI KO LEKAR CONNECT KREGA , yah wala line server.js mai likha  hua hai  
    .then(() => {
        console.log("successfully connected to database");
    })
    .catch(err => {
        console.log("error connecting to DB:", err.message); // Print actual error message
        process.exit(1); // agar database se connect nahi hota hai to server ko band kr dega
    })
}

module.exports = connectTODB; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is function ko dusre files me import kar sakte hain.  