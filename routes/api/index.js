const router = require('express').Router();

router.use('/api', require('./auth/login'));
router.use('/api', require('./tasks/get_tasks'));
router.use('/api', require('./tasks/get_mytasks'));
router.use('/api', require('./track/track'));

router.use((req, res, next) => {
	console.log('there')
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({errors: [err.message]});
});

module.exports = router;
