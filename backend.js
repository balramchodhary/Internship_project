var express=require('express');
const mysql=require('mysql');
const port=process.env.PORT || 8000;
var path = require('path')
const bodyparser = require('body-parser');
const { copyFileSync } = require('fs');


var app=express();
// Body-parser middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
  
var client = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    database: 'add',
    password: '',
    port: 3306,
});

client.connect(function(err){
    if(err){
      console.log(err);
    }else{
      console.log('you successfully connected!!')
    }
  });
  
  app.use(express.static(path.join(__dirname, 'user')));
  app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "nav.html");
  });
  app.get('/signup', function(req, res) {
    res.sendFile(__dirname + "/" + "signup.html");
  });
  app.get('/signin', function(req, res) {
    res.sendFile(__dirname + "/" + "signin.html");
  });

  //this is database operation for backend
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
                res.send("insert the data successfully");
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
                      res.send("welcome")
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
  