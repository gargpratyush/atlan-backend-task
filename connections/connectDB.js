const mysql = require("mysql");
const logger = require('../logs/logger')
require('dotenv').config();
const { Sequelize } = require('sequelize');

const db = mysql.createConnection({
    host: `${process.env.MYSQLHOST}`,
    user: `${process.env.MYSQLUSER}`,
    password: `${process.env.MYSQLPASSWORD}`,
    database: `${process.env.MYSQLDATABASE}`
})

// Connect
setTimeout(_ => {
    let start = Date.now()

    db.connect((err) => {
    if(err) {
        logger.error('DB is not connected properly')
        throw err;
    }
    logger.info('MySql is connected successfully')
    });

    let end = Date.now()
    logger.info(`DB connected in: ${end-start} miliseconds`);
    if((end-start) > 5) {
        logger.warn('DB is overloaded')
    }
}, 1000)

module.exports = db