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
var checkLogin=require('./checkLogin')
var viewPreviousIntern=require('./viewPreviousIntern')


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
app.use('/check',checkLogin)
app.use('/viewPreviousInternship',viewPreviousIntern)


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
  res.render("add_internship", { userData: data.userData });
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





app.post('/submit', auth, function (req, res) {
  data.userData.cname = req.body.demo;
  console.log(req.body.demo)
  res.render('resume', { userData: data.userData })
})
app.post('/check-Response',auth,async (req,res)=>{
  var cname = req.body.demo;
  var CompanyDetails = await Company.find({
    cname: cname
  })
  res.render('companyData', { title: 'Users details', details: CompanyDetails, userData: data.userData });
})
app.post('/final-submit', upload.single('image'),auth, async (req, res) => {
  try {
    
    var D = new Company({
      cname: data.userData.cname,
      fname: data.userData.fname,
      email: data.userData.email,
      filename: req.file.filename
    })
    
  
    var details=await Details.findOne({cname: data.userData.cname})
    
    if(parseFloat(req.body.cpi)<parseFloat(details.cpi)) res.send("<h1>your cpi is low</h1>")
    else{
      var Det = await D.save();
      res.status(201).render("successMsg",{msg1 : `you successfully applied on ${data.userData.cname}`,
              msg2: "your data successfully inserted data into database"});
    }
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
})




app.listen(port, function () {
  console.log(`listening prot number ${port}`);
});
module.exports = app;
