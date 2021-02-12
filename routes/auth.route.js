// Validators
const authValidator = require('~/validators/auth.validator');

// Controllers
const authController = require('~/controllers/auth.controller');

module.exports = (router) => {
	// POST
	/**
		* @swagger
		* /auth/login:
		*   post:
		*     summary: Login user
		*     description: Authentication user login
		*     tags:
		*       - Auth
		*     security: []
		*     requestBody:
		*       $ref: '#/components/requestBodies/AuthLoginBody'
		*     produces:
		*       - application/json
		*     responses:
		*       200:
		*        description: OK
		*        content:
		*          application/json:
		*            schema:
		*              type: object
		*              properties:
		*                $ref: '#/components/schemas/Reward'
		*                  
	*/
	router.post(
		'/auth/login',
		authController.login
	);

	// PUT
	/**
		* @swagger
		* /auth/register:
		*   put:
		*     summary: Register user
		*     description: Authentication user registration
		*     tags:
		*       - Auth
		*     security: []
		*     requestBody:
		*       $ref: '#/components/requestBodies/AuthRegisterBody'
		*     produces:
		*       - application/json
		*     responses:
		*       201:
		*        description: Created
		*        content:
		*          application/json:
		*            schema:
		*              type: object
		*              properties:
		*                user:
		*                  type: object
		*                  $ref: '#/components/schemas/User'
		*                  
	*/
	router.put(
		'/auth/register',
		authValidator.PUT,
		authController.register
	);
}