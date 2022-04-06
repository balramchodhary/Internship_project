
require('./rdbms');
var Details=require("./models/details");
var Company=require("./models/company")
var detail=require('./models/details')
const express=require('express');
const await = require('await');
const bodyparser = require('body-parser');
var router=express.Router();
const auth=require('./auth');
var data=require('./data')
var userData=data.userData

//* GET home page. */
// this script to fetch data from MySQL databse table
router.get('/', auth,async(req, res, next)=> {
  try {
    if(userData.email==='admin@gmail.com')
    res.render('user-list-admin', { title: 'company details', details: userData.result1,userData:userData});
    else 
    res.render('user-list', { title: 'company details', details: userData.result1,userData:userData});
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
});

router.post('/', auth,async(req, res, next)=> {
  try {
    
    if(userData.email==='admin@gmail.com'){
      result= await Details.find({cpi:{$gte : req.body.range}});
      res.render('user-list-admin', { title: 'company details', details: result,userData:userData});
    }
    else{
      result= await Details.find({cpi:{$gte : req.body.range}});
      res.render('user-list', { title: 'company details', details: result,userData:userData});
    }
  } catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
});
module.exports = router;