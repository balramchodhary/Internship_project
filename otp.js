require('./rdbms');
var Register = require("./models/registers");

const express = require('express');
const await = require('await');
const bodyparser = require('body-parser');
var router = express.Router();
const data = require('./data')
const auth=require('./auth')




router.post("/",auth,async(req,res)=>{
    try {
        var otp=req.body.otp1+req.body.otp2+req.body.otp3+req.body.otp4;
        if(parseInt(otp)===parseInt(data.registerData.otp)){
            var R = new Register({
                fname: data.registerData.fname,
                lname: data.registerData.lname,
                email: data.registerData.email,
                phone: data.registerData.phone,
                password: data.registerData.password
              })
              const token = await R.generateAuthToken();
              res.cookie("jwt", token, {
                expires: new Date(Date.now() + 50000),
                httpOnly: true
              })
    
              const reg = await R.save();
              res.status(201).render("successMsg",{msg1 : "you successfully enrolled on student portal",
              msg2: "your register data successfully inserted into database"});
        }else{
            res.send("<h1>sorry otp is worng</h1>")
        }
    } catch (err) {
        res.render('errorMsg.hbs',{msg:"user already exist into database so use different email account"})
    }
})
module.exports = router;
