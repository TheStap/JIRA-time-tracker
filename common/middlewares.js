const Exception = require("./errors").Exception;
const ValidationException = require("./errors").ValidationException;
const URLRegex = require('./httpService').URLRegex;

const baseUrlChecker = (req, res, next) => {
    let apiBaseUrl = req.headers['x-api-base-url'];
    if (!apiBaseUrl) {
        next(new Exception(401, 'Api base url is required'));
    }
    else if (!URLRegex.test(apiBaseUrl)) {
        next(new ValidationException(['Api base url should be url']));
    }
    else {
        next();
    }
};

const sessionIdChecker = (req, res, next) => {
    if (req.cookies && !req.cookies['JSID']) {
        next(new Exception(401, 'JIRA session id is required'));
    } else {
        next();
    }
};

const setDefaultHeaders = (req, res, next) => {
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', '*');
    next();
};

module.exports = {baseUrlChecker, sessionIdChecker, setDefaultHeaders};
