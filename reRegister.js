require('./rdbms');
var Register = require("./models/registers");

const express = require('express');
const await = require('await');
const bodyparser = require('body-parser');
var router = express.Router();
const data = require('./data')
const nodemailer=require('nodemailer')
const crypto=require('crypto')
const Math=require('math')


//mail sender detail
var transporter=nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: 'balramchoudhary314@gmail.com',
    pass: 'ovyreoqrklpqiout'
  },
  tls:{
    rejectUnauthorized: false
  }
})

router.get('/', async (req, res) => {

  try {
    
     
    
    
    
      
      //send varification mail to user
      var otp =   Math.floor(1000 + Math.random() * 9000);
      
      data.registerData.otp=otp
      var mailOptions={
        
        from: '"verify your email"<balramchoudhary314@gmail.com>',
        to:data.registerData.email,
        subject:'--verify your email',
        html:`<h1>${data.registerData.fname}! thank for registering in our web</h1>
        <h3>please enter otp ${otp}</h3>
        `
      }
      //sending a mail
      transporter.sendMail(mailOptions,function(err,info){
        if(err) console.log(err)
        else{
              console.log('verificaltion email send to your account')
        }
      })
      res.redirect('/send-otp')
      
    
  } catch (error) {
    res.render('errorMsg.hbs',{msg:"otp is not send successfully so please try after some time"})
  }

});

module.exports = router;