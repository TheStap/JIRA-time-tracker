const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/api/userRoutes');
const routes = require('./routes/api/routes');
const notFoundHandler = require("./common/errors").notFoundHandler;
const exceptionHandler = require("./common/errors").exceptionHandler;
const cors = require("cors");

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

if (process.env.NODE_ENV === 'dev') {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(routes);

app.use(userRoutes);

app.use(notFoundHandler);

app.use(exceptionHandler);

module.exports = app;
