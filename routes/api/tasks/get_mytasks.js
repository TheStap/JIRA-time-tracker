const generateIssues = require("./helpers/task-helpers").generateIssues;
const taskFilter = require("./helpers/task-helpers").taskFilter;

const router = require('express').Router();
const HttpService = require("../../../common/httpService").HttpService;

const tasksFromDashboard = 'assignee = currentUser() AND resolution = unresolved ORDER BY priority DESC, created ASC';

router.get('/mytasks/get', async (req, res, next) => {
    const apiBaseUrl = req.headers['x-api-base-url'];
    const JSID = req.cookies.JSID;
    const filter = {...taskFilter, jql: tasksFromDashboard};
    try {
        const data = await HttpService.sendGetRequest(apiBaseUrl, filter, ['api', '2', 'search'], JSID);
        res.status(200).send(generateIssues(data.data.issues));
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;
