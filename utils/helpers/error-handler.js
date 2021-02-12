// Constants
const { STATUS_ERROR, STATUS_INTERNAL_SERVER_ERROR } = require('~/utils/constants/http-status');

const errorHandler = (error, req, res, next) => {
	// get error details
  const code = error.statusCode || STATUS_INTERNAL_SERVER_ERROR.code;
  const message = error.message;
  const errors = error.errors;

	// log error
	console.error('Error::', {
		endpoint: req.url,
		method: req.method,
		code,
		message
	});

	// return error response
  res.status(code).json({
		status: {
			code,
			message
		},
		errors
	});
};

const throwCustomError = (message, code, errors) => {
	const error = new Error(message || STATUS_ERROR.message);
	error.statusCode = code || STATUS_ERROR.code;
	if (errors) {
		error.errors = errors.array();
	}
	throw error;
}

const throwInternalError = (err, next) => {
	if (!err.statusCode) {
		err.statusCode = STATUS_INTERNAL_SERVER_ERROR.code;
	}
	return next(err);
}

module.exports = {
	errorHandler,
	throwCustomError,
	throwInternalError
};