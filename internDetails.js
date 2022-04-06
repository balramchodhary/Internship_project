require('./rdbms');
var Details=require("./models/details");
const express=require('express');
const await = require('await');
const bodyparser = require('body-parser');
var router=express.Router();
const auth=require('./auth');
const userData=require('./data')


router.post('/',auth,async (req, res) => {
    try {
      var obj = {
        cname: req.body.cname,
        stipend: req.body.stipend,
        cpi: req.body.cpi,
        duration: req.body.duration
        , date: req.body.date
      }
      var D = new Details({
        cname: obj.cname,
        stipend: obj.stipend,
        cpi: obj.cpi,
        duration: obj.duration,
        date: obj.date
      })
  
      var Det = await D.save();
      res.render("successMsg")
    } catch (error) {
      res.status(400).send(error);
    }
  });
  module.exports = router;