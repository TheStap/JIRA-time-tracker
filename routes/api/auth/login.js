const router = require('express').Router();
const axios = require('axios');
const HttpService = require("../../../common/httpService").HttpService;
const ValidationException = require("../../../common/errors").ValidationException;
const Exception = require("../../../common/errors").Exception;

const NEXT_YEAR = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

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
        const data = await HttpService.sendPostRequest(apiBaseUrl, {password, username}, ['auth', '1', 'session']);
        const session = data.data.session;
        res.cookie('JSID', `${session.name}=${session.value}`, {
            expires: NEXT_YEAR,
            httpOnly: false
        }).status(204).send();
    }
    catch (e) {
        next(e);
    }
});

module.exports = router;
