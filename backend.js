var express=require('express');
const client=require('./dbms');
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
  

  //this is database operation for backend
  app.post('/interndetail', function(req, res) {
    var v1=req.body.cname;
    var v2=req.body.stipend;
    var v3=req.body.cpi;
    var v4=req.body.duration;
    var query="INSERT into internship_detail(cname,stipund,cpi,duration) values('"+v1+"','"+v2+"','"+v3+"','"+v4+"')";
    client.query(query, (err,result) => {
      if (err)
            res.send(500,'<h1>your company is duplicate so please try agian<h1>') 
            else {
                console.log("hello balram");
                res.send("insert the data successfully");
            }
    });
    
  });
  app.post('/register', function(req, res) {
    var v1=req.body.fname;
    var v2=req.body.lname;
    var v3=req.body.email;
    var v4=req.body.password;
    var query="INSERT into sigup(fname,lname,email,passowrd) values('"+v1+"','"+v2+"','"+v3+"','"+v4+"')";
    client.query(query, (err,result) => {
      if (err)
            res.send(500,'<h1>your email is duplicate so please try agian<h1>') 
            else {
                console.log("hello balram");
                res.sendFile(__dirname + "/" + "signin.html");
            }
    });
    
  });
  app.post('/check', function(req, res) {
    var v1=req.body.email;
    var v2=req.body.password;
    var query="SELECT * FROM `sigup`";
    client.query(query, (err,result) => {
      if (err)
            res.send(err.stack) 
            else {
              var flag=true;
              for(var i=0;i<result.length;i++){
                    if(result[i].email==v1&&result[i].passowrd==v2) {
                      console.log(v1);
                      console.log(v2);
                      res.sendFile(__dirname + "/" + "home_user.html");
                      flag=false;
                    }
              }
              if(flag) res.send("sorry");
            }
    });
    
  });
  
  
app.listen(port,function(){
    console.log("listening prot number 3000");
  });
  