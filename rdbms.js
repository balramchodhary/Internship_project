
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://balram:12345@cluster0.kgpb5.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



module.exports=client;
