const generateIssues = require("./helpers/task-helpers").generateIssues;

const router = require('express').Router();
const axios = require('axios');
const taskFilter = require("./helpers/task-helpers").taskFilter;
const ValidationException = require("../../../common/errors").ValidationException;
const Exception = require("../../../common/errors").Exception;
const HttpService = require("../../../common/httpService").HttpService;

router.get('/tasks/get', async (req, res, next) => {
    const {searchText} = req.query;
    const apiBaseUrl = req.headers['x-api-base-url'];
    const JSID = req.cookies.JSID;

    if (!searchText || (searchText && !searchText.trim())) {
        return next(new ValidationException('searchText is required'))
    }
    const filter = {...taskFilter, jql: generateJQL(searchText)};
    try {
        const data = await HttpService.sendGetRequest(apiBaseUrl, filter, ['api', '2', 'search'], JSID);
        res.status(200).send(generateIssues(data.data.issues));
    }
    catch (err) {
        return next(err);
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
