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

// Utils
const { throwCustomError, throwInternalError } = require('~/utils/helpers/error-handler');

const register = (req, res, next) => {
  const errors = validationResult(req);
	
  if (!errors.isEmpty()) {
		throwCustomError(
			'Validation failed.', 
			STATUS_UNPROCESSABLE_ENTITY.code,
			errors
		);
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then(user => {
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
  const email = req.body.email || '';
  const password = req.body.password || '';
  let loadedUser;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
				throwCustomError(
					'User not found.', 
					STATUS_UNAUTHORIZED.code
				);
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
				throwCustomError(
					'Invalid email or password!', 
					STATUS_UNAUTHORIZED.code
				);
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(STATUS_SUCCESS.code).json({
				status: STATUS_SUCCESS,
				data: { 
					userId: loadedUser._id.toString(),
					token
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