const bcrypt = require('bcrypt');
const hbs=require('hbs')
var jwt = require('jsonwebtoken');
const express=require('express');
const path=require('path')
const app=express();
const {isEmail} = require('validator');
var cookieParser = require('cookie-parser')
const fs=require('fs');
app.use(cookieParser())
// const {Error}=require('console')
// const fie=fs.readFileSync('partias/nav.hbs','utf-8');
let log='login.hbs'
let sig='signin.hbs'
const maxAge=3*24*60*60
const checkuser=(req,res,next)=>{
  
  const token=req.cookies.jwt
  if(token){
    jwt.verify(token,'patel harsh secret',async(err,decoded)=>{
  
      if(err){
        res.locals.user=null
     next()
      }
      else{
        console.log(decoded)
        let user=await Patel.findById(decoded.id)
        res.locals.user=user;
        next();
      }});
}
else{
  res.locals.user=null;
  next();
}

}
const middlever=(req,res,next)=>{
const token=req.cookies.jwt;
if(token){
jwt.verify(token,'patel harsh secret',(err,decoded)=>{
  
 if(err){
   res.redirect('/login')

 }
 else{
   
  //  console.log(decoded)
   next();}
  
 
})}
else{
  res.redirect('/login')
}}
const createtoken=(id)=>{
  return jwt.sign({ id },'patel harsh secret',{
    expiresIn:maxAge
  })
}
let ob={email:"",password:""}
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const mongoose=require('mongoose');
const { urlencoded } = require('express');
const { resourceUsage } = require('process');
const { error, time } = require('console');
const { runInNewContext } = require('vm');
// const { default: isEmail } = require('validator/lib/isEmail');
mongoose.connect('mongodb+srv://harsh706974:hPxCqTeG7zNjDOtn@cluster0.un92s.mongodb.net/?retryWrites=true&w=majority').then(()=>{
  console.log("con sucess");
})
const hendleerror= (err)=>{
 

  if(err.message.includes('patel validation failed')){
    Object.values(err.errors).forEach((e)=>{
      ob[e.path]=e.message;    
    })
    console.log(err.errors)
  }
  else{
    console.log(err)
  }
  if(err.code===11000){
    ob.email="email is already exist"
   }
  return ob;
  
}
const scheema=new mongoose.Schema({
  Fullname:{type:String
  
  },
  collegename:String,
  email:{
    type:String,
    required:[true,'please enter email'],
    unique:[true,'email is already exist'],
    validate:[isEmail,"please enter valid email"]
  },

  password :{
    type:String,
    required:[true,'please enter password'],
    minlength:[8,'please enter password etlist 8 character']
  },
  history:Array
  
})
scheema.pre('save',async function(next){
let salt= await bcrypt.genSalt();
this.password=await bcrypt.hash(this.password,salt);
next()
});
const Patel =mongoose.model('patel', scheema);
  
  
app.get('*',checkuser);
app.get('/Logout',(req,res)=>{
  res.cookie('jwt','',{maxAge:1})
res.redirect("/")
})

    // v.save()
app.set('view engine','ejs');
// app.set('views',path.join(__dirname,'/public'))
// hbs.registerPartials(path.join(__dirname,'/partias'))
app.get('/',(req,res)=>{
  res.render('Home',{active:'home'})
})
app.get('/User',checkuser,async(req,res)=>{
// res.render('User')
const token=req.cookies.jwt
  const decoded = jwt.verify(token, "patel harsh secret");
  const dat=await Patel.findById({_id:decoded.id});
  
  res.render('User',{kalu:dat.history})

})
app.get('/Help',(req,res)=>{
  res.render('Help',{active:'help'})
})

app.get('/SignIn',(req,res)=>{
  res.render('signin',{error:ob,active:'signin'})
})
app.get('/Login',(req,res)=>{
  
  res.render('login',{active:'login'})
})

app.post('/signin', async(req,res)=>{
  
try{

// let y= await Patel.find({email:req.body.email})É


let no=await Patel.create(req.body)
const token= await createtoken(no._id)
res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge})
res.json({user:no._id})

  // res.redirect('/')


  } catch (error) {
    
    let op=hendleerror(error);
    res.status(404).send(op)
   
  }
  
})
// app.get('*',checkuser);
// app.get('/nav',checkuser,(req,res)=>{
//   res.render('nav')
// })


app.post('/login', async(req,res)=>{
  // console.log(req.body)
  const err={email:"",password:""};
    try {
      const email=req.body.email;
    let user=await Patel.findOne({email})
  if(user){
      let pass=await bcrypt.compare(req.body.password,user.password)
    if(pass){
      const token=createtoken(user._id)
res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*40000})
    
    
    }
    else{
     err.password="invlaid password"
    }
   
  }
else{
  err.email="invalid email"
 
}
if(!(err.email===""&&err.password==="")){
  res.status(400).json(err)
}
else{
  res.status(200).json({user:user._id})
}
    } catch (error) {
      res.status(400).json({error:error})
    }
  
  
  
 
})



// app.post('/')


app.post('/history',middlever, async(req,res)=>{
  // const token=req.cookies.token;
  // let dat;
  

  const token=req.cookies.jwt
  const decoded = jwt.verify(token, "patel harsh secret");  
// var userId = decoded.user_data.user_id  
// console.log(decoded)    
let datl=await Patel.findOne({_id:decoded.id})
y=datl.history;
console.log(y)
let ye=['JAN','FEB','MAR','APR','MAY','JUN','JLY','AUG','SPT','OCT','NOV','DEC'];
let day=['SUN','MON','TUE','WED','THUR','FRI','SAT'];
// let o=[1,2,3];
let da=new Date()
y.push({place:req.body.place,time:`Date: ${da.getDate()} ${ye[da.getMonth()]} ${da.getFullYear()} | ${
day[da.getDay()]}  ${(da.getHours())}:${da.getMinutes()}`})
    let dat=await Patel.findByIdAndUpdate(decoded.id,{history:y})
    
// console.log(y);
res.send(dat)// res.send('user')
})

const port=process.env.PORT||5000
app.listen(port,()=>{
  
  console.log('jskf')
})
