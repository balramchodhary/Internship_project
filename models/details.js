var mongoose=require("mongoose");

var Schema1=new mongoose.Schema({
    cname:{
        type:String,
        require:true,
        unique:true
    },
    stipend:{
        type:String,
        require:true
    },
    cpi:{
        type:String,
        require:true
    },
    duration:{
        type:String,
        require:true
    }
})

var Test=new mongoose.model("details",Schema1);
 
module.exports=Test;