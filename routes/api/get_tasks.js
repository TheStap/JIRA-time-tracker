const router = require('express').Router();
const axios = require('axios');

router.post('/tasks/get', (req, res, next) => {
	let {searchText, apiBaseUrl} = req.body;
	if (searchText && apiBaseUrl) {
		let jql = '';
		if (!isNaN(parseFloat(searchText))) {
			jql = `text ~ "${searchText}" OR id = "MVM-${searchText}"`;
		}
		else if (/MVM-[1-9]/.test(searchText)) {
			jql = `text ~ "${searchText}" OR id = "${searchText}"`
		}
		else {
			jql = `text ~ "${searchText}"`;
		}
		console.log(jql);
		axios.get(`${apiBaseUrl}/rest/api/2/search`,
			{
				params: {
					jql: jql,
					fields: 'attachment, description, summary'
				},
				headers: {
					cookie: req.cookies.jsid,
					"Content-Type": "application/json"
				}
			}
		).then(r => {
			res.status(200);
			let issues = r.data.issues.map(item => {
				let apiDescription = item.fields.description;
				let description = apiDescription ? generateDescription(apiDescription).filter((issue) => issue.trim()) : '';
				return {
					description: description ? prepareDescription(description, item.fields.attachment) : '',
					summary: item.fields.summary,
					id: item.key
				}
			});
			res.send(issues);
		}).catch(e => {
			res.status(e.response.status);
			res.send({errors: e.response.data.errorMessages});
		})
	} else {
		res.status(401);
		res.json({errors: ['SearchText and apiBaseUrl required']});
	}
});


function generateDescription(description) {
	return description.replace(/(\r\n)+(\r)+/g, '').split('\n');
}

function generatePictureLink(pic, links) {
	let result = '';
	let pictureName = pic.replace(/!/g, '');
	for (let link of links) {
		if (link.filename === pictureName) {
			result = link.content;
			break;
		}
	}
	return result;
}

function prepareDescription(descriptions, attachments) {
	return descriptions.map((description) => {
		if (description.match(/(![^\s!]+!)/g)) {
			return {
				type: 'link',
				value: generatePictureLink(description, attachments)
			}
		} else {
			return {
				type: 'text',
				value: description
			}
		}
	})
}


module.exports = router;
