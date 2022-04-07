require('./rdbms');
var Bcrypt=require('bcryptjs')
//here we import our modules
var Register = require("./models/registers");
var Company=require('./models/company')
var Details=require('./models/details')


const express = require('express');
const await = require('await');
const bodyparser = require('body-parser');
var router = express.Router();
var data = require('./data')
var userData=data.userData

router.post('/', async (req, res) => {
    try {
      var obj = {
        email: req.body.email,
        password: req.body.password
      }

      var useremail = await Register.findOne({
        email: obj.email
      })

      var company=await Company.find({email: obj.email})

      const companies = [];

      //here we store the all company name in our database
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
 
        //here we store user information for
        userData.fname = useremail.fname;
        userData.email = useremail.email;
        userData.password=useremail.password;

        if(obj.email=='admin@gmail.com'){
          userData.result1= await Details.find({});
          res.render('user-list-admin', { title: 'company details', details: userData.result1, userData: userData });
        }
        else {
          userData.result1= await Details.find({$and: [{cname:{$not :{$in: companies}}},{date:{$gte : temp_date}}]});
          res.render('user-list', { title: 'company details', details: userData.result1, userData: userData });
        }
        
      }
      else res.send("<h1>your login unsuccessful</h1>")
  
    } catch (error) {
      res.render('errorMsg.hbs',{msg:"your user name and password are wrong please try again"})
    }
  });

module.exports = router;
