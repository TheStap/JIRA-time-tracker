const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();
const axios = require('axios');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: true,
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/test', (req, res, next) => {
	res.send('hi!');
});

app.post('/login', (req, res, next) => {
	let body = req.body;
	if (body.password && body.login) {
		axios.post('https://jira.goods.ru/rest/auth/1/session',
			{
				username: body.login,
				password: body.password
			},
			{
				headers: {
					'content-type': 'application/json'
				}
			}).then(r => {
				if (r.status === '200')
				{

				}
			console.log(r.response);
		}).catch(e => {
			res.status(e.response.status);
			res.send({error: e.response.data.errorMessages})
		})
	}
	else {
		res.status(401);
		res.json({err: 'Password and login required'});
	}
});


app.use(function (req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
