
require('./rdbms');
var Details=require("./models/details");
const express=require('express');
const await = require('await');
var router=express.Router();
const auth=require('./auth');
/* GET home page. */
// this script to fetch data from MySQL databse table
router.get('/', auth,async(req, res, next)=> {
  try {
    var result=await Details.find({});
    res.render('user-list', { title: 'company details', userData: result});
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;