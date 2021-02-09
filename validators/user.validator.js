// Libraries
const { body } = require('express-validator/check');

module.exports = {
	PUT: [
		body('name')
			.trim()
			.not().isEmpty()
	]
}