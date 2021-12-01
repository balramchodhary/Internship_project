const mysql=require('mysql');

var client = mysql.createConnection({
    user: 'sql5455052',
    host: 'sql5.freesqldatabase.com',
    database: 'sql5455052',
    password: 'SH3kTwaFHq',
    port: 3306,
});

client.connect(function(err){
    if(err){
      console.log(err);
    }else{
      console.log('you successfully connected!!')
    }
  });
  
module.exports=client;