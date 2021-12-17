
require('./rdbms');
var Details=require("./models/details");
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
    var result=await Details.find({});
    res.render('user-list', { title: 'company details', details: result,userData:userData});
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post('/', auth,async(req, res, next)=> {
  try {
    const range=req.body.range;
    var result=await Details.find({cpi: {$gte:range}});
    res.render('user-list', { title: 'company details', details: result,userData:userData});
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;