var express=require('express');
const client=require('./rdbms');
const port=process.env.PORT || 8000;
var path = require('path')
var indexRouter=require('./indexRouter');
const bodyparser = require('body-parser');
const { copyFileSync } = require('fs');


var app=express();
// Body-parser middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

  app.use('/viewInternship',indexRouter);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'user')));



  app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "home.html");
  });
  
  app.get('/signup', function(req, res) {
    res.sendFile(__dirname + "/" + "signup.html");
  });
  app.get('/signin', function(req, res) {
    res.sendFile(__dirname + "/" + "signin.html");
  });
  app.get('/addInternship', function(req, res) {
    res.sendFile(__dirname + "/" + "add_internship.html");
  });
  app.get('/logout', function(req,res){
    req.logOut();
    req.session.destroy(function (err) {
           res.redirect('/'); //Inside a callback… bulletproof!
       });
   });

  //this is database operation for backend
  app.post('/interndetail', function(req, res) {
    var obj={
      cname:req.body.cname,
      stipend:req.body.stipend,
      cpi:req.body.cpi,
      duration:req.body.duration
    }
    client.connect(err => {
      const collection = client.db("test").collection("details");
      collection.insertOne(obj, function(err, res) {
        if (err) throw err;
    });
    res.send("<h1>hello </h1>");
      // perform actions on the collection object
    });
    
    
  });
  app.post('/register', function(req, res) {
    var obj={
      fname:req.body.fname,
      lname:req.body.lname,
      email:req.body.email,
      password:req.body.password,
    }
    client.connect(err => {
      const collection = client.db("test").collection("test");
      collection.insertOne(obj, function(err, res) {
        if (err) throw err;
    });
    res.sendFile(__dirname + "/" + "signin.html");
      // perform actions on the collection object
    });
    
  });
  app.post('/check', function(req, res) {
    var v1=req.body.email;
    var v2=req.body.password;
    client.connect(err => {
      const collection = client.db("test").collection("test");
      
     collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      for(var i=0;i<result.length;i++){
        var flag=true;
        if(v1==result[0].email&&v2==result[0].password){
          res.sendFile(__dirname + "/" + "home_user.html");
          flag=false;
        }
      }
      if(flag) res.send("<h1>sorry user password and email is not exist so create account</h1>");
    });
  });
  });
  
  
app.listen(port,function(){
    console.log("listening prot number 3000");
  });
  