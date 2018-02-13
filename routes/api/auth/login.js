const router = require('express').Router();
const axios = require('axios');
const Exception = require("../../../common/errors").Exception;

router.post('/login', (req, res, next) => {
    let apiBaseUrl = req.headers['x-api-base-url'];
    if (!apiBaseUrl)
    {
        throw new Exception(400, 'test');
    }

    let {password, username} = req.body;
    if (password && username && apiBaseUrl) {
        axios.post(`${apiBaseUrl}/rest/auth/1/session`,
            {password, username},
            {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then(data => {
                if (data.status === 200)
                {
                    let session = data.data.session;

                    res.cookie('JSID', `${session.name}=${session.value}`, {
                        expires  : new Date('2019-02-02'),
                        httpOnly : false
                    });

                    res.status(204).send();
                }
                else {
                    next()
                }
            })
            .catch(e => {
                res.status(e.response.status);
                res.send({errors: ['Wrong login or password']})
            })
    }
    else {
        res.status(401);
        res.json({errors: ['Password, login and JIRA url are required']});
    }
});

module.exports = router;
