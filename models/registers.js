var mongoose=require("mongoose");
var bcrypt=require("bcryptjs");
const await = require("await");
const jwt = require("jsonwebtoken");
var Schema1=new mongoose.Schema({
    fname:{
        type:String,
        require:true
    },
    lname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    }
    ,
    phone:{
        type:String,
        require:true,
    }
    ,
    password:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
})
Schema1.methods.generateAuthToken=async function(){
    try {
       const token= await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
       this.tokens=this.tokens.concat({token:token})
       await this.save();
       return token;
    } catch (error) {
        return "sorry here a error"
    }
}
Schema1.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
    next()
})
var Test=new mongoose.model("tests",Schema1);
 
module.exports=Test;