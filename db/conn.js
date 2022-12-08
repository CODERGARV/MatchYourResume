const  mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/GetYourResume", {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connect to db success");
}).catch((e)=>{
    console.log(e);
    console.log("failed to connect to db");
})
