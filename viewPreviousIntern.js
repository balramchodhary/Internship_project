require('./rdbms');

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

router.get('/', async (req, res) => {
    try {
      var obj = {
        email: userData.email,
        password: userData.password
      }

      

      var company=await Company.find({email: obj.email})

      const companies = [];

      //here we store the all company name in our database
      for(var i=0;i<company.length;i++){
         companies[i]=company[i].cname
      }

     


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
        userData.result2= await Details.find({cname:{$in: companies}});
        //here we store user information for
       
        
        res.render('previous_intern', { title: 'company details', details: userData.result2, userData: userData });
      
      
  
    }
    catch (error) {
      res.status(400).send(error);
    }
  });

module.exports = router;
