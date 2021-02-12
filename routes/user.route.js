// Validators
const userValidator = require('~/validators/user.validator');

// Controllers
const userController = require('~/controllers/user.controller');

module.exports = (router) => {
	// GET
	/**
		* @swagger
		* /user:
		*   get:
		*     summary: Get user
		*     description: Get user information
		*     tags:
		*      - User
		*     security:
		*      - BearerAuth: []
		*     produces:
		*      - application/json
		*     responses:
		*       200:
		*         description: OK
		*         content:
		*           application/json:
		*             schema:
		*               type: object
		*               properties:
		*                 user:
		*                   type: object
		*                   $ref: '#/components/schemas/User'
	*/
	router.get(
		'/user',
		userController.getUser
	);

	// PUT
	/**
		* @swagger
		* /user:
		*   put:
		*     summary: Update user
		*     description: Update user information
		*     tags:
		*       - User
		*     security:
		*       - BearerAuth: []
		*     requestBody:
		*       $ref: '#/components/requestBodies/UpdateUserBody'
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
		*                user:
		*                  type: object
		*                  $ref: '#/components/schemas/User'
	*/
	router.put(
		'/user',
		userValidator.PUT,
		userController.updateUser
	);
}