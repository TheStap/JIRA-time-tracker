const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/api/userRoutes');
const routes = require('./routes/api/routes');
const ValidationException = require("./common/errors").ValidationException;
const Exception = require("./common/errors").Exception;
const exceptionHandler = require("./common/errors").exceptionHandler;
const URLRegex = require('./common/httpService').URLRegex;

const app = express();

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use((req, res, next) => {
    let apiBaseUrl = req.headers['x-api-base-url'];
    if (!apiBaseUrl) {
        next(new Exception(401, 'Api base url is required'));
    }
    else if (!URLRegex.test(apiBaseUrl)) {
        next(new ValidationException('Api base url should be url'));
    }
    else {
        next();
    }
});

app.use(routes);

app.use((req, res, next) => {
    if (req.cookies && !req.cookies['JSID']) {
        next(new Exception(401, 'JIRA session id is required'));
    } else {
        next();
    }
});

app.use(userRoutes);

app.use((req, res, next) => {
    next(new Exception(404, 'Not Found'))
});

app.use(exceptionHandler);

module.exports = app;
