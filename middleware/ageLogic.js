const logger = require('../logs/logger');

const ageLogic = async (req, res, next) => {
    if(req.body.question_id === '1') {
        if(parseInt(req.body.response_value) >= 18) {
            logger.info('Age > 18')
            next();
        }
        else {
            logger.info('Age Logic triggered')
            res.send('Age should be greater than 18 to fill this form')
        }
    }
}

module.exports = ageLogic