const  mongoose=require("mongoose");

mongoose.connect(process.env.db, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connect to db success");
}).catch((e)=>{
    console.log(e);
    console.log("failed to connect to db");
})
