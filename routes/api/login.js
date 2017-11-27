const router = require('express').Router();
const axios = require('axios');
const cookieParser = require('cookie-parser');

router.post('/login', (req, res, next) => {

    let body = req.body;
    let {password, login} = body;
    if (password && login) {
        axios.post('https://jira.goods.ru/rest/auth/1/session',
            {
                username: login,
                password: password
            },
            {
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then(data => {
                debugger
                if (data.status === 200)
                {
                    let session = data.data.session;
                    res.status(data.status);
                    res.set({
                        'set-cookie': `${session.name}=${session.value}`,
                    })
                    res.send('ok');
                }
                else {
                    next()
                }
            })
            .catch(e => {
                res.status(e.response.status);
                res.send({errors: e.response.data.errorMessages})
            })
    }
    else {
        res.status(401);
        res.json({errors: 'Password and login required'});
    }
});

module.exports = router;
