const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/api/userRoutes');
const routes = require('./routes/api/routes');
const setDefaultHeaders = require("./common/middlewares").setDefaultHeaders;
const sessionIdChecker = require("./common/middlewares").sessionIdChecker;
const baseUrlChecker = require("./common/middlewares").baseUrlChecker;
const notFoundHandler = require("./common/errors").notFoundHandler;
const exceptionHandler = require("./common/errors").exceptionHandler;
const cors = require("cors");

const app = express();

app.use(cors());

app.use(setDefaultHeaders);

if (process.env.NODE_ENV === 'dev') {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(baseUrlChecker);

app.use(routes);

app.use(sessionIdChecker);

app.use(userRoutes);

// TODO: rework not found handler, make it apply before checkers middlewares
app.use(notFoundHandler);

app.use(exceptionHandler);

module.exports = app;
