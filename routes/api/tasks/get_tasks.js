const generateIssues = require("./helpers/task-helpers");

const router = require('express').Router();
const axios = require('axios');
const Exception = require("../../../common/errors").Exception;

router.get('/tasks/get', async (req, res, next) => {
    const {searchText} = req.query;
    const apiBaseUrl = req.headers['x-api-base-url'];
    try {
        const data = await axios.get(`${apiBaseUrl}sd/rest/api/2/search`,
            {
                params: {
                    jql: generateProperJql(searchText),
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
        if (e.response.status === 401) {
            next(new Exception(e.response.status, 'Unauthorized'))
        }
        else {
            next(new Exception(502, 'Error'))
        }
    }
});

const jiraTaskIdRegEx = /[a-zA-Z]-[1-9]/;

function generateProperJql(searchText) {
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
