const router = require('express').Router();

router.use('/api', require('./login'));
router.use('/api', require('./get_tasks'));

router.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send({errors: ['Not Found']});
});

module.exports = router;
