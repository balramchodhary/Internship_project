require('./rdbms');
const express = require('express');
const await = require('await');
const bodyparser = require('body-parser');
const userData = require('./data');

const Register=require('./models/registers')
var router = express.Router();

router.get('/',async(req,res)=>{
    try {
        const emailToken=req.query.token
        const user=await Register.findOne{{emailToken:emailToken}}
        if(user){
            user.emailToken=null
            user.isVerified=true
            await user.save()
            res.redirect('/')
        }else{
            res.redirect('/signup')
            console.log("email is not verified")
        }
    } 
    catch (error) {
        console.log(error)
    }
})

module.exports = router;