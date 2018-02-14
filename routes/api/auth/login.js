const router = require('express').Router();
const axios = require('axios');
const ValidationException = require("../../../common/errors").ValidationException;
const Exception = require("../../../common/errors").Exception;

router.post('/login', async (req, res, next) => {
    const {password, username} = req.body;
    const apiBaseUrl = req.headers['x-api-base-url'];

    const validationExceptions = [];
    if (!password || (password && !password.trim())) {
        validationExceptions.push('password is required');
    }
    if (!username || (username && !username.trim())) {
        validationExceptions.push('username is required');
    }
    if (validationExceptions.length) {
        next(new ValidationException(validationExceptions));
    }

    try {
        const data = await axios.post(`${apiBaseUrl}/rest/auth/1/session`,
            {password, username},
            {
                headers: {
                    'content-type': 'application/json'
                }
            });
        const session = data.data.session;
        res.cookie('JSID', `${session.name}=${session.value}`, {
            expires: new Date('2019-02-02'),
            httpOnly: false
        });
        res.status(204).send();
    }
    catch (e) {
        next(new Exception(401, 'Wrong login or password'));
    }
});

module.exports = router;
