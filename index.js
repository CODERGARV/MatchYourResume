if(process.env.NODE_ENV!=="production"){
    require("dotenv").config()
}
const port=process.env.PORT||3000;
const express=require("express");
const app=express();
const bcrypt=require("bcrypt");
const uuid=require("uuid");
require("./db/conn");
const Register=require("./models/register");
const Upload=require("./models/upload");
const flash=require("connect-flash");
const session=require("express-session");


app.use(express.urlencoded({extended:false}));
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(session({
    secret:uuid.v4() ,
    resave: false, // we want to resave session 
    saveUninitialized: false
}))
app.set("view engine","ejs");


app.post("/register", async (req,res)=>{
    try {
        console.log(req.body);
        const registerUser=new Register({
            name:req.body.name,
            college:req.body.college,
            email:req.body.email,
            password:req.body.password,
        })
        const registered=await registerUser.save();
        res.redirect("login");
    } catch (e) {
        console.log(e);
        req.flash('InvalidRegister','User already present or some error occured');
        res.redirect("/register");
    }
})

app.post("/login",async (req,res)=>{
    try{
        const email=req.body.email;
        const pass=req.body.password;
        const user=await Register.findOne({email:email,password:pass});
        // console.log(user);
        req.session.user=user;
        if(user!=null){
            res.redirect('/dashboard');
        }else{
            req.flash('InvalidUser','Your Email id or password does not matches with db');
            res.redirect("/login");
        }
    }catch(e){
        console.log(e);
        res.redirect("/login");
    }
})

app.post("/upload",async(req,res)=>{
    try {
        console.log(req.body);
        const uploadResume=new Upload({
            resume:req.body.resume,
            email:req.session.user.email,
            college:req.session.user.college,
            likeCount:0
        })
        const uploaded=await uploadResume.save();
        res.redirect("/dashboard");
    } catch (e) {
        console.log(e);
        res.redirect("/dashboard");
    }
})

app.post('/posts/:id/act', async (req, res) => {
    const action = req.body.action;
    const counter = action === 'Like' ? 1 : -1;
    const rname=await Upload.findOne({_id:req.params.id});
    const resume=rname.resume;
    // console.log(resume);
    if(counter==1){
        Register.updateOne(
            { "email": req.session.user.email},
            { "$push": { "likedResume":  resume} },
            function (err, raw) {
                if (err) return handleError(err);
                // console.log('The raw response from Mongo was ', raw);
            }
         );
    }else{
        Register.updateOne(
            { "email": req.session.user.email},
            { "$pull": { "likedResume":  resume} },
            function (err, raw) {
                if (err) return handleError(err);
                // console.log('The raw response from Mongo was ', raw);
            }
         );
    }
    
    Upload.updateOne({_id: req.params.id}, {$inc: {likeCount: counter}}, {}, (err, numberAffected) => {
    });
});
app.get('/',(req,res)=>{
    res.render("index.ejs");
})

app.get('/login',(req,res)=>{
    res.render("login.ejs",{InvalidUser : req.flash("InvalidUser")});
})

app.get('/register',(req,res)=>{
    res.render("register.ejs",{InvalidRegister: req.flash("InvalidRegister")});
}) 
function cmp(a,b){
    var la=a.likeCount;
    var lb=b.likeCount;
    if (la > lb) {
        return -1;
      }
    if (la < lb) {
        return 1;
      }
    return 0;
}
app.get('/dashboard',async (req,res)=>{
    if(req.session.user){
        const email=req.session.user.email;
        const resumeList=await Upload.find({email:email});
        const iitResume=await Upload.find({college:"IIT"});
        const iiitResume=await Upload.find({college:"IIIT"});
        const nitResume=await Upload.find({college:"NIT"});
        const otherResume=await Upload.find({college:"Other"});
        const user=await Register.find({email});
        iitResume.sort(cmp);
        iiitResume.sort(cmp);
        nitResume.sort(cmp);
        otherResume.sort(cmp);
        // console.log(iitResume);
        // console.log(req.session.user.likedResume);
        res.render('dashboard.ejs',{user : user[0],resumeList: resumeList,iiitResume,iitResume,nitResume,otherResume});
    }else{
        res.redirect('/');
    }
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    })
})
app.listen(port,()=>{
    console.log(`server listning on port ${port}`);
});