// Validators
const authValidator = require('~/validators/auth.validator');

// Controllers
const authController = require('~/controllers/auth.controller');

module.exports = (router) => {
	// POST
	router.post(
		'/auth/login',
		authController.login
	);

	// PUT
	router.put(
		'/auth/register',
		authValidator.PUT,
		authController.register
	);
}