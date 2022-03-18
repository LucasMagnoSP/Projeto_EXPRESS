
const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit: 10,
    user:'root',
    password:'',
    database: 'nodemysql'
})
module.exports = pool