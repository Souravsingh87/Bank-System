const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")  


const userSchema = new mongoose.Schema ({
    email:{
        type:String,
        unique:[true,"Email already exists, please login instead"], 
        required:[true,"Email is required for crating an account"],
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"please provide a valid email address"]
        
    },
    name:{
        type:String,
        required:[true,"Name is required for creating an account"]
    },

 password:{
  type:String,
   required:[true,"password is required for creating an account"],
   minLength:[6,"password must be at least 6 characters long"],
   select:false
 },  

 systemUser:{
   type:Boolean,
   default:false,
   immutable:true,
   select:false
 }
},{
    timestamps:true // createdAt aur updatedAt fields ko automatically add kar dega
})
userSchema.pre("save",async function(){ // save hone se pehle ye function chalega, isme hum password ko hash karenge
    if(!this.isModified("password")){ // agar password modify nahi hua hai to next() call kar dega, isse password ko baar baar hash hone se bachayega
        return next() ; // hash karne kliye npm i bcryptjs ka use karenge, isse hum password ko securely hash kar sakte hain
    }
    const hash = await bcrypt.hash(this.password,10); // password ko hash karne ke liye bcrypt ka use karenge, 10 salt rounds denge
    this.password = hash; // password ko hash karke wapas userSchema ke password field me daal denge
     return next() ; // next() call kar denge, isse save hone ka process continue ho jayega
})
userSchema.methods.comparePassword =  async function(password){ // ye method user instance pe call hoga, isme hum plain text password ko hashed password se compare karenge
    return await bcrypt.compare(password,this.password); // bcrypt ka compare method use karenge, jo plain text password aur hashed password ko compare karega
}   
//const UserModel = mongoose.model("User",userSchema); // userSchema se User model banayenge
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = UserModel; // isko export krne ke liye humne module.exports ka use kiya hai, jisse hum is model ko dusre files me import kar sakte hain.    