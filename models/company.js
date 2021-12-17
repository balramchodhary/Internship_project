var mongoose=require("mongoose");

var Schema1=new mongoose.Schema({
    cname:{
        type:String,
        require:true,
    },
    fname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    }
})

var Test=new mongoose.model("company",Schema1);
 
module.exports=Test;