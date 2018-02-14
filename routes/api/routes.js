const router = require('express').Router();

router.use('/api', require('./auth/login'));

module.exports = router;
