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
      res.status(201).render("successMsg",{msg1 : "you successfully added new internship",
              msg2: "your data successfully inserted data into database"});
    } catch (error) {
      res.render('errorMsg.hbs',{msg:"this company already exist so please enter valid company name"})
    }
  });
  module.exports = router;