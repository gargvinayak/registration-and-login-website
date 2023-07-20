const express = require("express")
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
let alert = require('alert');
const bodyparser = require("body-parser")
require('dotenv').config();
const PORT = process.env.PORT || 3000 ;
mongoose.set('strictQuery',false);

app.set('view-engine','pug')
app.set('views', path.join(__dirname,'views'))
app.use('/static',express.static('static'))

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const connectDB = async ()=> {
    try{
      await mongoose.connect(process.env.MONGO_URI);
    } catch(error){
      console.log(error);
      process.exit(1);
    }
}

const employeeSchema = new mongoose.Schema({
    firstname : {
        type:String,
        required:true
    },
    lastname : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    gender : {
        type:String,
        required:true
    },
    age : {
        type:String,
        required:true
    },
    number : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    confirmpass : {
        type:String,
        required:true
    }
})

employeeSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password,10)
    this.confirmpass = undefined;
    next();
})

const Register = new mongoose.model('Register',employeeSchema)


app.get('/',(req,res)=>{
    const con ='this is content using pug'
    const params = {'title':'pug template', 'content':con}
res.status(200).render('index.pug',params)
})

app.get('/registration',(req,res)=>{  
res.status(200).render('registration.pug')
})
app.get('/google68a62590dbf4b821.html',(req,res)=>{  
res.status(200).render('google68a62590dbf4b821.html')
})

app.get('/login',(req,res)=>{
res.status(200).render('login.pug')
})

app.post("/registration", async (req,res)=>{
    
    const pass = req.body.password;
    const conpass = req.body.confirmpass;
    try{
    if(pass === conpass){
        var employeedata = new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            gender:req.body.gender,
            number:req.body.number,
            age:req.body.age,
            password:req.body.password,
            confirmpass:req.body.confirmpass
        });
        await employeedata.save();
        //alert("I am an alert box!");
        res.status(200).render('index.pug')
       
    }
    else{
        res.send("password not matching")
    }
    console.log(pass)
    } catch(error){

       res.status(400).send('This User Already Exists ')
}
    })

    app.post("/login", async (req,res)=>{
      try {
        console.log(req.body.email)
        const userdata = await Register.findOne({email:req.body.email})
        const ismatch =  await bcrypt.compare(req.body.password,userdata.password);
        console.log(ismatch);
        if(ismatch){
            // console.log(userdata)
            res.status(201).render('index.pug')
        }
        else{
         res.send("You have entered incorrect password")
        }
        
       
      } catch (error) {
        res.status(400).send("Invalid Login Details");
      }
    })
    
   
   
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("pug server started")
    })
    })
