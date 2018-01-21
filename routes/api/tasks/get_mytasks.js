const generateIssues =  require("./helpers/task-helpers");

const router = require('express').Router();
const axios = require('axios');

router.post('/mytasks/get', (req, res, next) => {
	let {apiBaseUrl} = req.body;
	const tasksFromDashboard = 'assignee = currentUser() AND resolution = unresolved ORDER BY priority DESC, created ASC';
	if (apiBaseUrl) {
		if (req.cookies.hasOwnProperty('JSID')) {
			axios.get(`${apiBaseUrl}/rest/api/2/search`,
				{
					params: {
						jql: tasksFromDashboard,
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
				console.log(e);
				res.status(e.response.status);
				res.send({errors: e.response.data.errorMessages});
			})
		}
		else {
			res.status(401);
			res.json({errors: ['JSID required']});
		}
	} else {
		res.status(401);
		res.json({errors: ['apiBaseUrl required']});
	}
});

module.exports = router;