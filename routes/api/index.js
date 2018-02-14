const exceptionHandler = require("../../common/errors").exceptionHandler;
const Exception = require("../../common/errors").Exception;
const router = require('express').Router();

router.use('/api', require('./auth/login'));
router.use('/api', require('./tasks/get_tasks'));
router.use('/api', require('./tasks/get_mytasks'));
router.use('/api', require('./track/track'));

router.use((req, res, next) => {
    next(new Exception(404, 'Not Found'));
});

router.use(exceptionHandler);

module.exports = router;
