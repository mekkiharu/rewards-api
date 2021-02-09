// Libraries
const { body } = require('express-validator/check');

module.exports = {
	POST: [
		body('name')
			.trim()
			.not().isEmpty(),
		body('description')
			.trim()
			.not().isEmpty(),
		body('quantity')
			.trim()
			.not().isEmpty()
			.isInt()
	],
	PUT: [
		body('name')
			.trim()
			.not().isEmpty(),
		body('description')
			.trim()
			.not().isEmpty(),
		body('quantity')
			.trim()
			.not().isEmpty()
			.isInt()
	]
}