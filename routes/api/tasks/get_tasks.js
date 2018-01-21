const generateIssues =  require("./helpers/task-helpers");

const router = require('express').Router();
const axios = require('axios');

router.post('/tasks/get', (req, res, next) => {
	let {searchText, apiBaseUrl} = req.body;
	if (searchText && apiBaseUrl) {
		if (req.cookies.hasOwnProperty('JSID')) {
			axios.get(`${apiBaseUrl}/rest/api/2/search`,
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
			).then(r => {
				res.status(200);
				res.send(generateIssues(r.data.issues));
			}).catch(e => {
				res.status(e.response.status);
				res.send({errors: e.response.data.errorMessages});
			})
		} else {
			res.status(401);
			res.json({errors: ['JSID required']});
		}

	} else {
		res.status(401);
		res.json({errors: ['SearchText and apiBaseUrl required']});
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
