const mysql = require("mysql");
require('dotenv').config();

const db = mysql.createConnection({
    host: `${process.env.MYSQLHOST}`,
    user: `${process.env.MYSQLUSER}`,
    password: `${process.env.MYSQLPASSWORD}`,
    database: `${process.env.MYSQLDATABASE}`
})

// Connect
db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySql connected...')
});

module.exports = db