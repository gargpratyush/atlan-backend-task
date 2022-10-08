const express = require('express');
const router = express.Router();

const {collectResponse} = require('../controllers/collectResponseC')

router.route('/').post(collectResponse);


 
module.exports = router