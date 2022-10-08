const express = require('express');
const router = express.Router();

const {fillForm} = require('../controllers/fillformC')
const {clearForm} = require('../controllers/clearformC')

router.route('/clear').get(clearForm);
router.route('/:id').get(fillForm);


 
module.exports = router

 