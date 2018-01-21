function generateIssues(issues) {
	return issues.map(item => {
		let apiDescription = item.fields.description;
		let description = apiDescription ? generateDescription(apiDescription).filter((issue) => issue.trim()) : '';
		return {
			description: description ? prepareDescription(description, item.fields.attachment) : '',
			summary: item.fields.summary,
			id: item.key
		}
	});
}


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

module.exports = generateIssues;