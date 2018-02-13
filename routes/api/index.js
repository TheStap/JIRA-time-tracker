const Exception = require("../../common/errors").Exception;
const ValidationException = require("../../common/errors").ValidationException;
const router = require('express').Router();

router.use('/api', require('./auth/login'));
router.use('/api', require('./tasks/get_tasks'));
router.use('/api', require('./tasks/get_mytasks'));
router.use('/api', require('./track/track'));

router.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use((err, req, res, next) => {
    let body;
    if (err instanceof ValidationException) {
        body = err.validationErrors;
        res.status = err.statusCode;
    }
    else if (err instanceof Exception) {
        body = err.message;
        res.status = err.statusCode;
    }
    else {
        body = {message: 'Ошибка сервера', error: err};
        res.status = 500;
    }
    res.send(body);
});

module.exports = router;
