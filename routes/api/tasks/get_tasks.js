const generateIssues = require("./helpers/task-helpers");

const router = require('express').Router();
const axios = require('axios');
const ValidationException = require("../../../common/errors").ValidationException;
const Exception = require("../../../common/errors").Exception;

router.get('/tasks/get', async (req, res, next) => {
    const {searchText} = req.query;
    const apiBaseUrl = req.headers['x-api-base-url'];
    if (!searchText || (searchText && !searchText.trim())) {
        next(new ValidationException('searchText is required'))
    }
    try {
        const data = await axios.get(`${apiBaseUrl}/rest/api/2/search`,
            {
                params: {
                    jql: generateJQL(searchText),
                    expand: 'renderedFields',
                    fields: 'attachment, description, summary'
                },
                headers: {
                    cookie: req.cookies.JSID,
                    "Content-Type": "application/json"
                }
            }
        );
        res.status(200).send(generateIssues(data.data.issues));
    }
    catch (e) {
        if (e.response && e.response.status === 401) {
            next(new Exception(e.response.status, 'Unauthorized'))
        }
        else {
            next(new Exception(502, 'Error'))
        }
    }
});

const jiraTaskIdRegEx = /[a-zA-Z]-[1-9]/;

function generateJQL(searchText) {
    let jql = '';
    if (jiraTaskIdRegEx.test(searchText)) {
        jql = `text ~ "${searchText}" OR id = "${searchText}"`
    }
    else {
        jql = `text ~ "${searchText}"`;
    }
    return jql;
}

module.exports = router;
