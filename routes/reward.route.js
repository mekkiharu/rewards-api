// Validators
const rewardValidator = require('~/validators/reward.validator');

// Controllers
const rewardController = require('~/controllers/reward.controller');

module.exports = (router) => {
	// GET
	/**
		* @swagger
		* /rewards:
		*   get:
		*     summary: Get rewards
		*     description: Get rewards list information
		*     tags:
		*       - Reward
		*     security:
		*       - BearerAuth: []
		*     produces:
		*       - application/json
		*     parameters:
		*       - in: query
		*         name: currentPage
		*         required: false
		*         schema:
		*           type: integer
		*           example: 1
		*         description: offset for pagination
		*       - in: query
		*         name: itemsPerPage
		*         required: false
		*         schema:
		*           type: integer
		*           example: 10
		*         description: limit for pagination
		*     responses:
		*       200:
		*        description: OK
		*        content:
		*          application/json:
		*            schema:
		*              type: object
		*              properties:
		*                rewards:
		*                  type: array
		*                  items:
		*                    allof:
		*                      - $ref: '#/components/schemas/Reward'
	*/
	router.get(
		'/rewards', 
		rewardController.getRewards
	);

	// GET
	/**
		* @swagger
		* /reward/:rewardId:
		*   get:
		*     summary: Get reward
		*     description: Get reward information
		*     tags:
		*       - Reward
		*     security:
		*       - BearerAuth: []
		*     produces:
		*       - application/json
		*     parameters:
		*       - in: path
		*         name: rewardId
		*         required: true
		*         schema:
		*           type: integer
		*           example: 6022f3a1e3d9e0a0450f6292
		*         description: the id from reward information
		*     responses:
		*       200:
		*        description: OK
		*        content:
		*          application/json:
		*            schema:
		*              type: object
		*              properties:
		*                reward:
		*                  type: object
		*                  $ref: '#/components/schemas/Reward'
	*/
	router.get(
		'/reward/:rewardId', 
		rewardController.getReward
	);

	// POST
	/**
		* @swagger
		* /rewards:
		*   post:
		*     summary: Add reward
		*     description: Add reward information
		*     tags:
		*       - Reward
		*     security:
		*       - BearerAuth: []
		*     requestBody:
		*       $ref: '#/components/requestBodies/AddRewardBody'
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
		*                reward:
		*                  type: object
		*                  $ref: '#/components/schemas/Reward'
	*/
	router.post(
		'/rewards',
		rewardValidator.POST,
		rewardController.addReward
	);

	// PUT
	/**
		* @swagger
		* /reward/:rewardId:
		*   put:
		*     summary: Update reward
		*     description: Update reward information
		*     tags:
		*       - Reward
		*     security:
		*       - BearerAuth: []
		*     parameters:
		*       - in: path
		*         name: rewardId
		*         required: true
		*         schema:
		*           type: integer
		*           example: 6022f3a1e3d9e0a0450f6292
		*         description: the id from reward information
		*     requestBody:
		*       $ref: '#/components/requestBodies/UpdateRewardBody'
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
		*                reward:
		*                  type: object
		*                  $ref: '#/components/schemas/Reward'
	*/
	router.put(
		'/reward/:rewardId',
		rewardValidator.PUT,
		rewardController.updateReward
	);

	// PUT
	/**
		* @swagger
		* /reward/redeem/:rewardId:
		*   put:
		*     summary: Redeem reward
		*     description: Redeem reward to logged in user
		*     tags:
		*       - Reward
		*     security:
		*       - BearerAuth: []
		*     parameters:
		*       - in: path
		*         name: rewardId
		*         required: true
		*         schema:
		*           type: integer
		*           example: 6022f3a1e3d9e0a0450f6292
		*         description: the id from reward information
		*     responses:
		*       204:
		*        description: No Content
	*/
	router.put(
		'/reward/redeem/:rewardId',
		rewardController.redeemReward
	);

	// DELETE
	/**
		* @swagger
		* /reward/:rewardId:
		*   delete:
		*     summary: Delete reward
		*     description: Delete reward information
		*     tags:
		*       - Reward
		*     security:
		*       - BearerAuth: []
		*     parameters:
		*       - in: path
		*         name: rewardId
		*         required: true
		*         schema:
		*           type: integer
		*           example: 6022f3a1e3d9e0a0450f6292
		*         description: the id from reward information
		*     responses:
		*       204:
		*        description: No Content
	*/
	router.delete(
		'/reward/:rewardId',
		rewardController.deleteReward
	);
}