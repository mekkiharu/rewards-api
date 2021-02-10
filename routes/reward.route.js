// Validators
const rewardValidator = require('~/validators/reward.validator');

// Controllers
const rewardController = require('~/controllers/reward.controller');

module.exports = (router) => {
	// GET
	router.get(
		'/rewards', 
		rewardController.getRewards
	);
	router.get(
		'/reward/:rewardId', 
		rewardController.getReward
	);

	// POST
	router.post(
		'/rewards',
		rewardValidator.POST,
		rewardController.addReward
	);

	// PUT
	router.put(
		'/reward/:rewardId',
		rewardValidator.PUT,
		rewardController.updateReward
	);
	router.put(
		'/reward/redeem/:rewardId',
		rewardController.redeemReward
	);

	// DELETE
	router.delete(
		'/reward/:rewardId',
		rewardController.deleteReward
	);
}