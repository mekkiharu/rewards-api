// Libraries
const jwt = require('jsonwebtoken');
const _ = require('lodash')

// Constants
const publicEndpoints = require('~/utils/constants/public-endpoints.js');
const { STATUS_UNAUTHORIZED } = require('~/utils/constants/http-status');

// Utils
const { throwCustomError, throwInternalError } = require('~/utils/helpers/error-handler');

module.exports = (req, res, next) => {
	const { url, method } = req;
	
	const isPublicEndpoint = _.find(publicEndpoints, { url, method });

	if (!isPublicEndpoint) {
		const authHeader = req.get('Authorization');

		if (!authHeader) {
			throwCustomError(
				'Not authenticated.', 
				STATUS_UNAUTHORIZED.code
			);
		}

		const token = authHeader.split(' ')[1];
		let decodedToken;

		try {
			decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
      throwInternalError(err, next);
		}

		if (!decodedToken) {
			throwCustomError(
				'Not authenticated.', 
				STATUS_UNAUTHORIZED.code
			);
		}

		req.userId = decodedToken.userId;
	}

  next();
};
