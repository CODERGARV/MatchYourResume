const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requried:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    likedResume:{
        type: [String],
        unique:true
    }
})
const register=new mongoose.model("Register",userSchema);
module.exports=register;