// Libraries
const { body } = require('express-validator/check');

// Models
const User = require('~/models/user.model');

module.exports = {
	PUT: [
		body('email')
			.trim()
			.not().isEmpty()
			.isEmail()
			.normalizeEmail({ gmail_remove_dots: false })
			.withMessage('Please enter a valid email address.')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then(userDoc => {
					if (userDoc) {
						return Promise.reject('Email address already exists!');
					}
				});
			}),
		body('password')
			.trim()
			.not().isEmpty()
			.isLength({ min: 6 }),
		body('name')
			.trim()
			.not().isEmpty()
	]
}