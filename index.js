const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const chat=require("./models/chat.js");

const PORT = 8080

const methodOverrid=require("method-override");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverrid("_method"));

main()
.then(()=>{
    console.log("connection success");
})
.catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

app.get("/",(req,res)=>{
    res.send("root is working");
});

//index route

app.get("/chats",async(req,res)=>{
     let chats=await chat.find();
     console.log(chats);
     res.render("index.ejs",{chats});
});

//new route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
});

//created route
app.post("/chats",(req,res)=>{
    let {from,to,msg}=req.body;
    let newchat=new chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date(),
    });
    newchat.save()
    .then((res)=>{
        console.log("chat was saved");
    })
    .catch((err)=>{
        console.log(err);
    });
    res.redirect("/chats");
});

//edit route
app.get("/chats/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let mychat=await chat.findById(id);
    res.render("edit.ejs",{chat:mychat});
});

//updated route
app.put("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    let {msg:newmsg}=req.body;
    console.log(newmsg);
    let updatedchat=await chat.findByIdAndUpdate(id,{msg:newmsg},
        {runValidators:true,new:true}
    );
    console.log(updatedchat);
    res.redirect("/chats");
});

//delete route
app.delete("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    let deletechat=await chat.findByIdAndDelete(id);
    console.log(deletechat);
    res.redirect("/chats");
});

app.listen(PORT,()=>{
    console.log("app is listenning to port 8080");
});