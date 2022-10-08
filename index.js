const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const ageLogic = require('./middleware/ageLogic');
const logger = require('./logs/logger');
require('dotenv').config();

// Logger
logger.error("error logs are being displayed");
logger.warn("warn logs are being displayed");
logger.info("info logs are being displayed");
logger.verbose("verbose logs are being displayed");
logger.debug("debug logs are being displayed");
logger.silly("silly logs are being displayed");
console.log('');

const collectresponse = require('./routes/collectresponse');
const fillsheet = require('./routes/fillsheet');

// Route for filling Google Sheet
app.use('/form', fillsheet);

app.use(bodyParser.json());

//Middleware for business logic (If question_id == 1 AND response_value < 18 then show error)
app.use(ageLogic);

// Route for POSTing form responses
app.use('/collect', collectresponse);



const port = process.env.PORT || 3000;
app.listen(port, (req,res) => logger.info(`Running on port ${port}!`));



