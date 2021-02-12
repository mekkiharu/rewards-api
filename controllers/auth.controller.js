// Libraries
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

// Models
const User = require('~/models/user.model');

// Constants
const { 
	STATUS_SUCCESS, 
	STATUS_CREATED,
	STATUS_UNAUTHORIZED,
	STATUS_UNPROCESSABLE_ENTITY
} = require('~/utils/constants/http-status');
const { EXPIRY } = require('~/utils/constants/token');

// Utils
const { throwCustomError, throwInternalError } = require('~/utils/helpers/error-handler');

const register = (req, res, next) => {
	// get validation error result
  const errors = validationResult(req);
	
  if (!errors.isEmpty()) {
		throwCustomError(
			'Validation failed.', 
			STATUS_UNPROCESSABLE_ENTITY.code,
			errors
		);
  }

	// get registration details
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

	// encrypt user password
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
			// save new user
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then(user => {
			// return user details as response
			const userDetails = {
				id: user._id,
				name: user.name,
				email: user.email,
				rewards: user.rewards
			};

      res.status(STATUS_CREATED.code).json({
				status: STATUS_CREATED,
				data: {
					user: userDetails
				}
			});
    })
    .catch(err => {
      throwInternalError(err, next);
    });
};

const login = (req, res, next) => {
	// get login details
  const email = req.body.email || '';
  const password = req.body.password || '';
  let loadedUser;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
				throwCustomError(
					'Invalid email or password!', 
					STATUS_UNAUTHORIZED.code
				);
      }

			// get current user
      loadedUser = user;

			// check if user password is correct
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
				throwCustomError(
					'Invalid email or password!', 
					STATUS_UNAUTHORIZED.code
				);
      }

			// get jwt token based on user information
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: EXPIRY.hours }
      );

      res.status(STATUS_SUCCESS.code).json({
				status: STATUS_SUCCESS,
				data: { 
					userId: loadedUser._id.toString(),
					token,
					expiresIn: EXPIRY.seconds
				}
			});
    })
    .catch(err => {
      throwInternalError(err, next);
    });
};

module.exports = {
	register,
	login
}