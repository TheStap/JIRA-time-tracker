const router = require('express').Router();
const axios = require('axios');

router.post('/track', (req, res, next) => {
	let {time, taskId, apiBaseUrl} = req.body;
	let totalTime = generateTimeInSeconds(time);
	if (apiBaseUrl && totalTime && taskId) {
		if (req.cookies.hasOwnProperty('JSID')) {
			axios.post(`${apiBaseUrl}/rest/api/2/issue/${taskId}/worklog`,
				{
					"comment": "I did some work here.",
					"started": getDefaultDate(),
					"timeSpentSeconds": totalTime
				},
				{
					headers: {
						cookie: req.cookies.JSID,
						"Content-Type": "application/json"
					}
				}
			).then(r => {
				res.status(200);
				res.send(r.data);
			}).catch(e => {
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
		res.json({errors: ['apiBaseUrl and time required']});
	}
});

function generateTimeInSeconds(time)
{
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