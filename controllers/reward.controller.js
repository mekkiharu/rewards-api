// Libraries
const fs = require('fs');
const path = require('path');
const _ = require('lodash')
const { validationResult } = require('express-validator/check');

// Models
const Reward = require('~/models/reward.model');
const User = require('~/models/user.model');

// Constants
const { 
	DEFAULT_ITEMS_PER_PAGE, 
	DEFAULT_CURRENT_PAGE 
} = require('~/utils/constants/pagination');
const { 
	STATUS_SUCCESS, 
	STATUS_CREATED,
	STATUS_NO_CONTENT,
	STATUS_NOT_FOUND,
	STATUS_BAD_REQUEST,
	STATUS_UNPROCESSABLE_ENTITY,
	STATUS_INTERNAL_SERVER_ERROR,
	STATUS_ERROR
} = require('~/utils/constants/http-status');

// Utils
const { throwCustomError, throwInternalError } = require('~/utils/helpers/error-handler');
const { uploadFile } = require('~/utils/helpers/uploader.js');

const getRewards = (req, res, next) => {
	// get pagination query params
  const currentPage = parseInt(req.query.currentPage) || DEFAULT_CURRENT_PAGE;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE;
  let totalCount;
  
	Reward.find()
    .countDocuments()
    .then(count => {
      totalCount = count;

			// get rewards based on pagination details
      return Reward.find()
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);
    })
    .then(rewards => {
      res.status(200).json({
				status: STATUS_SUCCESS,
				data: {
					rewards,
					pagination: {
						totalCount: totalCount,
						currentPage: currentPage,
						itemsPerPage: itemsPerPage,
						pageCount: Math.ceil(totalCount / itemsPerPage)
					}
				}
			});
    })
    .catch(err => {
      throwInternalError(err, next);
    });
};

const getReward = (req, res, next) => {
  const rewardId = req.params.rewardId;
  
	Reward.findById(rewardId)
    .then(reward => {
      if (!reward) {
				throwCustomError(
					'Reward not found.', 
					STATUS_NOT_FOUND.code
				);
      }
      res.status(STATUS_SUCCESS.code).json({
				status: STATUS_SUCCESS,
				data: {
					reward
				}
			});
    })
    .catch(err => {
      throwInternalError(err, next);
    });
};

const addReward = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
		throwCustomError(
			'Validation failed.', 
			STATUS_UNPROCESSABLE_ENTITY.code,
			errors
		);
  }

  if (!req.file) {
		throwCustomError(
			'No image provided.', 
			STATUS_UNPROCESSABLE_ENTITY.code
		);
  }

	uploadFile(req.file, (imageUrl, err) => {
		if (err) {
			throwCustomError(
				'Error uploading image.', 
				STATUS_INTERNAL_SERVER_ERROR.code
			);
		}

		// get reward details
		const name = req.body.name;
		const description = req.body.description;
		const quantity = req.body.quantity;

		// create and save reward
		const reward = new Reward({
			name,
			description,
			quantity,
			imageUrl
		});
		
		reward
			.save()
			.then(result => {
				res.status(STATUS_CREATED.code).json({
					status: STATUS_CREATED,
					data: {
						reward
					}
				});
			})
			.catch(() => {
				throwCustomError(
					STATUS_ERROR.message, 
					STATUS_ERROR.code
				);
			});
	});
};

const updateReward = (req, res, next) => {
	// get validation error result
  const errors = validationResult(req);

	// get reward id
  const rewardId = req.params.rewardId;
  
	if (!errors.isEmpty()) {
		throwCustomError(
			'Validation failed.', 
			STATUS_UNPROCESSABLE_ENTITY.code,
			errors
		);
  }

  if (!req.file) {
		throwCustomError(
			'No image provided.', 
			STATUS_UNPROCESSABLE_ENTITY.code
		);
  }

	uploadFile(req.file, (imageUrl, err) => {
		if (err) {
			throwCustomError(
				'Error uploading image.', 
				STATUS_INTERNAL_SERVER_ERROR.code
			);
		}

		// get reward details
		const name = req.body.name;
		const description = req.body.description;
		const quantity = req.body.quantity;

		Reward.findById(rewardId)
			.then(reward => {
				if (!reward) {
					throwCustomError(
						'Reward not found.', 
						STATUS_NOT_FOUND.code
					);
				}

				// update reward details
				reward.name = name;
				reward.description = description;
				reward.quantity = quantity;
				reward.imageUrl = imageUrl;

				return reward.save();
			})
			.then(reward => {
				res.status(STATUS_SUCCESS.code).json({
					status: STATUS_SUCCESS,
					data: {
						reward
					}
				});
			})
			.catch(error => {
				throwInternalError(error, next);
			});
		})
};

const deleteReward = (req, res, next) => {
  const rewardId = req.params.rewardId;

  Reward.findById(rewardId)
    .then(reward => {
			// check if reward exists
      if (!reward) {
				throwCustomError(
					'Reward not found.', 
					STATUS_NOT_FOUND.code
				);
      }
      return Reward.findByIdAndRemove(rewardId);
    })
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.rewards.pull(rewardId);
      return user.save();
    })
    .then(result => {
      res.status(STATUS_NO_CONTENT.code).json({
				status: STATUS_NO_CONTENT,
				data: {}
			});
    })
    .catch(err => {
      throwInternalError(err, next);
    });
};


const redeemReward = (req, res, next) => {
  const rewardId = req.params.rewardId;

	Reward.findById(rewardId)
		.then(reward => {
			// Check if reward does exist
			if (!reward) {
				throwCustomError(
					'Reward not found.', 
					STATUS_NOT_FOUND.code
				);
			}

			// Check if reward quantity > 0
			if (reward.quantity <= 0) {
				// Throw error that reward is out of stock
				throwCustomError(
					'Reward is out of stock.', 
					STATUS_BAD_REQUEST.code
				);
			}

			User.findById(req.userId)
				.then(user => {
					// Check if user already redeemed the reward
					if (_.find(user.rewards, reward._id)) {
						throwCustomError(
							'User already redeemed the reward.', 
							STATUS_BAD_REQUEST.code
						);
					} else {
						// Decrease reward quantity by 1
						reward.quantity -= 1;
						reward.save();

						// Add redeemed reward to user
						user.rewards.push(reward._id);
						user.save();

						res.status(STATUS_NO_CONTENT.code).json({
							status: STATUS_NO_CONTENT,
							data: {}
						});
					}
				})
				.catch(err => {
					throwInternalError(err, next);
				});
		})
		.catch(err => {
			throwInternalError(err, next);
		});
};

module.exports = {
	getRewards,
	getReward,
	addReward,
	updateReward,
	deleteReward,
	redeemReward
}