require('dotenv').config()
const cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var await = require('await');
require('./rdbms');
const port = process.env.PORT || 8000
var path = require('path')

//here we route all files
var indexRouter = require('./indexRouter')
var interndetail=require('./internDetails')
var register=require('./register')
var reRegister=require('./reRegister')
var otp=require('./otp')

//var verifyEmail=require('./verifyEmail')

const bodyparser = require('body-parser');
const { copyFileSync } = require('fs');
var hbs = require('hbs');


//here we import our data set tables
const Tests = require('./models/registers')
const Details = require('./models/details')
const Company = require('./models/company')
const Bcrypt = require('bcryptjs');
const auth = require('./auth')
var userData = require('./data')
var data=require('./data')
const multer=require('multer')



// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cookieParser())

//here we give the path of the router 
app.use('/viewInternship', indexRouter);
app.use('/interndetail', interndetail);
app.use('/register', register);
app.use('/user-verify-email', register);
app.use('/re-user-verify-email', reRegister);
app.use('/save-user',otp)


app.use(express.static(path.join(__dirname, './templates')))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './templates/views'));


hbs.registerPartials(path.join(__dirname, './templates/partials'))


//here we use multer 
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./templates/images')
  },
  filename: (req,file,cb)=>{
    console.log(file)
    cb(null,Date.now()+path.extname(file.originalname))
  }
})
const upload=multer({storage: storage})
app.get('/', function (req, res) {
  res.render("signin");
});

app.get('/signup', function (req, res) {
  res.render("signup");
});
app.get('/send-otp',function(req,res){
  res.render("otp",{email:data.registerData.email})
})
app.get('/signin', function (req, res) {
  res.render("signin");
});
app.get('/addInternship', auth, (req, res) => {
  res.render("add_internship", { userData: userData });
});
app.get('/logout', async (req, res) => {
  try {
    res.clearCookie('jwt')
    res.status(201).render("signin")
  } catch (error) {
    res.status(401).send(error)
  }
});

//this is database operation for backend
app.post('/viewPreviousInternship',auth,async (req,res)=>{
  try{
    //here we write a code
  }catch (error) {
    res.status(400).send(error);
  }
})



app.post('/check', async (req, res) => {
  try {
    var obj = {
      email: req.body.email,
      password: req.body.password
    }
    var useremail = await Tests.findOne({
      email: obj.email
    })
    var company=await Company.find({email: obj.email})
    const companies = [];
    for(var i=0;i<company.length;i++){
       companies[i]=company[i].cname
    }
    if (await Bcrypt.compare(obj.password, useremail.password)) {
      const token = await useremail.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 500000),
        httpOnly: true
      })
      var temp_date='';
      { // example 1
        let f = new Intl.DateTimeFormat('en');
        let a = f.formatToParts();
        const yy=a[4].value;
        const m1=a[0].value%10;
        const m2=a[0].value/10;
        const d1=a[2].value%10;
        const d2=a[2].value/10;

        temp_date=yy.toString()+'-'+m2.toString()+m1.toString()+'-'+d2.toString()+d1.toString();
     }
      userData.result= await Details.find({$and: [{cname:{$not :{$in: companies}}},{date:{$gte : temp_date}}]});
      //here we store user information for
      userData.fname = useremail.fname;
      userData.email = useremail.email;
      if(obj.email=='admin@gmail.com')
      res.render('user-list-admin', { title: 'company details', details: userData.result, userData: userData });
      else 
      res.render('user-list', { title: 'company details', details: userData.result, userData: userData });
    }
    else res.send("<h1>your login unsuccessful</h1>")

  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/submit', auth, function (req, res) {
  userData.cname = req.body.demo;
  res.render('resume', { userData: userData })
})
app.post('/check-Response',auth,async (req,res)=>{
  var cname = req.body.demo;
  var CompanyDetails = await Company.find({
    cname: cname
  })
  res.render('companyData', { title: 'Users details', details: CompanyDetails, userData: userData });
})
app.post('/final-submit', upload.single('image'),auth, async (req, res) => {
  try {
    
    var D = new Company({
      cname: userData.cname,
      fname: userData.fname,
      email: userData.email,
      filename: req.file.filename
    })
    
    var details=await Details.find({cname: userData.cname})
    if(parseFloat(req.body.cpi)-details.cpi<0) res.send("<h1>your cpi is low</h1>")
    var Det = await D.save();
    res.send("<h1>you successfully upload image</h1>")
  } catch (error) {
    res.status(400).send(error);
  }
})




app.listen(port, function () {
  console.log(`listening prot number ${port}`);
});
module.exports = app;
