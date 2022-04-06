
require('./rdbms');
var Details=require("./models/details");
var Company=require("./models/company")
const express=require('express');
const await = require('await');
const bodyparser = require('body-parser');
var router=express.Router();
const auth=require('./auth');
const userData=require('./data')

//* GET home page. */
// this script to fetch data from MySQL databse table
router.get('/', auth,async(req, res, next)=> {
  try {
    if(userData.email=='admin@gmail.com')
    res.render('user-list-admin', { title: 'company details', details: userData.result,userData:userData});
    else 
    res.render('user-list', { title: 'company details', details: userData.result,userData:userData});
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;