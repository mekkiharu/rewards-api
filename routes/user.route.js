// Validators
const userValidator = require('~/validators/user.validator');

// Controllers
const userController = require('~/controllers/user.controller');

module.exports = (router) => {
	// GET
	router.get(
		'/user',
		userController.getUser
	);

	// PUT
	router.put(
		'/user',
		userValidator.PUT,
		userController.updateUser
	);
}