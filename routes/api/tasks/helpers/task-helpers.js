function generateIssues(issues) {
	return issues.map(item => {
		return {
			description: item.renderedFields.description,
			summary: item.fields.summary,
			id: item.key
		}
	});
}

module.exports = generateIssues;
