const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./routes/api/index');
const exceptionHandler = require("./common/errors").exceptionHandler;
const Exception = require("./common/errors").Exception;
const ValidationException = require("./common/errors").ValidationException;

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use((req, res, next) => {
    let apiBaseUrl = req.headers['x-api-base-url'];
    if (!apiBaseUrl) {
        next(new ValidationException('Api base url is required'));
    }
    else {
        next();
    }
});

app.use(exceptionHandler);

app.use(router);

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

module.exports = app;
