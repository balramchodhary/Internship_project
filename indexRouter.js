const client=require('./rdbms');
const express=require('express');
var router=express.Router();
/* GET home page. */
// this script to fetch data from MySQL databse table
router.get('/', function(req, res, next) {
  client.connect(err => {
    const collection = client.db("test").collection("details");
    
   collection.find({}).toArray(function(err, result) {
    if (err) throw err;
    res.render('user-list', { title: 'User List', userData: result});
    
  });
});
});
module.exports = router;