
const mongoose = require('mongoose');
const uri = "mongodb+srv://balram:12345@cluster0.kgpb5.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log("database successfully connected");
}).catch((e)=>{
    console.log("sorry you not successfully connected with data base");
})
