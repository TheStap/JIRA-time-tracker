const exceptionHandler = require("../../common/errors").exceptionHandler;
const Exception = require("../../common/errors").Exception;
const router = require('express').Router();

router.use('/api', require('./tasks/get_tasks'));
router.use('/api', require('./tasks/get_mytasks'));
router.use('/api', require('./track/track'));

module.exports = router;
