const  mongoose=require("mongoose");
const db = 'mongodb+srv://codergarv:byDThQBPklGPucwL@cluster0.vfre3ai.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connect to db success");
}).catch((e)=>{
    console.log(e);
    console.log("failed to connect to db");
})
