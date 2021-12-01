const client=require('./dbms');
const express=require('express');
var router=express.Router();
/* GET home page. */
// this script to fetch data from MySQL databse table
router.get('/', function(req, res, next) {
    var sql='SELECT * FROM internship_detail';
    client.query(sql, function (err, data, fields) {
    if (err) throw err;
    console.log(data[0]);
    res.render('user-list', { title: 'User List', userData: data});
  });
});
module.exports = router;