const router = require('express').Router();
const ValidationException = require("../../../common/errors").ValidationException;
const HttpService = require("../../../common/httpService").HttpService;

router.post('/track', async (req, res, next) => {
    const apiBaseUrl = req.headers['x-api-base-url'];
    const JSID = req.cookies.JSID;
    const {time, taskId, comment, started} = req.body;

    const validationExceptions = [];
    if (!time) {
        validationExceptions.push('time is required');
    }
    else {
        const {hours, minutes} = time;
        const isBothFieldsNotValid = (hours && !isNumeric(hours)) && (minutes && !isNumeric(minutes));
        if (isBothFieldsNotValid) {
            validationExceptions.push('hours must be a number');
            validationExceptions.push('minutes must be a number');
        }
    }
    if (!taskId || (taskId && !taskId.trim())) {
        validationExceptions.push('taskId is required');
    }
    const totalTime = generateTimeInSeconds(time);
    if (!totalTime) {
        validationExceptions.push('total time must be more than 0 seconds');
    }
    if (validationExceptions.length) {
        return next(new ValidationException(validationExceptions));
    }

    const filter = {
        timeSpentSeconds: totalTime
    };
    if (comment) {
        filter.comment = comment;
    }
    filter.started = started ? started : getDefaultDate();
    try {
        // await HttpService.sendPostRequest(apiBaseUrl, filter, ['api', '2', 'issue', taskId, 'worklog'], JSID);
        res.status(204).send();
    }
    catch (e) {
        return next(e);
    }
});

function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}

function generateTimeInSeconds(time) {
    const {hours, minutes} = time;
    let result = 0;
    if (hours) {
        result += hours * 3600;
    }
    if (minutes) {
        result += minutes * 60;
    }
    return result;
}

function getDefaultDate() {
    return new Date().toISOString().replace('Z', '+0000');
}

module.exports = router;
