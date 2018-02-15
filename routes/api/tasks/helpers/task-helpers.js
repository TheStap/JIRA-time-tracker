function generateIssues(issues) {
	return issues.map(item => {
		return {
			description: item.renderedFields.description,
			summary: item.fields.summary,
			id: item.key
		}
	});
}

const taskFilter = {
    expand: 'renderedFields',
    fields: 'attachment, description, summary'
};

module.exports = {generateIssues, taskFilter};
