require("dotenv").config(); // ENV FILE KO IMPORT KRNE KE LIYE . jab tak yah wala nhi likhe yenge tab tk monga uri ka use nhi kar skte hai 


const app = require("./App.js"); 
const connectTODB = require("./Config/Db"); // DATABASE SE CONNECT KRNE KE LIYE FUNCTION KO IMPORT KRNE KE LIYE

connectTODB(); // DATABASE SE CONNECT KRNE KE LIYE      


app.listen(3000,()=>{
    console.log("server is running on port 3000");
});