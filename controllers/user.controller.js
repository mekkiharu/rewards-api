// Models
const User = require('~/models/user.model');

// Constants
const { 
	STATUS_SUCCESS, 
	STATUS_NOT_FOUND
} = require('~/utils/constants/http-status');

// Utils
const { throwCustomError, throwInternalError } = require('~/utils/helpers/error-handler');

const getUser = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
				throwCustomError(
					'User not found.', 
					STATUS_NOT_FOUND.code
				);
      }
			
			const userDetails = {
				id: user._id,
				name: user.name,
				email: user.email,
				rewards: user.rewards
			};

      res.status(STATUS_SUCCESS.code).json({
				status: STATUS_SUCCESS,
				data: {
					user: userDetails
				}
			});
    })
    .catch(err => {
      throwInternalError(err, next);
    });
};

const updateUser = (req, res, next) => {
  const name = req.body.name;
	
  User.findById(req.userId)
    .then(user => {
      if (!user) {
				throwCustomError(
					'User not found.', 
					STATUS_NOT_FOUND.code
				);
      }

      user.name = name;
      return user.save();
    })
    .then(user => {
			const userDetails = {
				id: user._id,
				name: user.name,
				email: user.email,
				rewards: user.rewards
			};

      res.status(STATUS_SUCCESS.code).json({
				status: STATUS_SUCCESS,
				data: {
					user: userDetails
				}
			});
    })
    .catch(err => {
      throwInternalError(err, next);
    });
};

module.exports = {
	getUser,
	updateUser
}