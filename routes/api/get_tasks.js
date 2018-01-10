const router = require('express').Router();
const axios = require('axios');

router.post('/tasks/get', (req, res, next) => {
	let {searchText, apiBaseUrl} = req.body;
	if (searchText && apiBaseUrl) {
		axios.get(`${apiBaseUrl}/rest/api/2/search`,
			{
				params: {
					jql: `text ~ "${searchText}" OR id = "${searchText}"`,
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
				let description = generateDescription(item.fields.description).filter((issue) => issue.trim());
				return {
					description: prepareDescription(description, item.fields.attachment),
					summary: item.fields.summary,
					id: item.key
				}
			});
			res.send(issues);
		}).catch(e => {
			res.status(401);
			res.send({errors: e});
			//TODO: add error handler
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
