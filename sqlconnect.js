const mysql=require('mysql')

var connection=mysql.createPool({
    connectionLimit: 20,
    host:'localhost',
    user: 'root',
    password:'*******',
    database:'esmp_project'
})

module.exports=connection;