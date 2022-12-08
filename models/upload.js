const mongoose=require("mongoose");
const resumeSchema=new mongoose.Schema({
    resume:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        requried:true,
    },
    college:{
        type:String,
        required:true
    },
    likeCount:{
        type:Number,
        default:0
    }
})
const upload=new mongoose.model("Upload",resumeSchema);
module.exports=upload;
