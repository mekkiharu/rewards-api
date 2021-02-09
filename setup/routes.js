// Libraries
const express = require('express');
const router = express.Router();

// Routes
const rewardRoutes = require('~/routes/reward.route');
const authRoutes = require('~/routes/auth.route');
const userRoutes = require('~/routes/user.route');

// Middlewares
const authMiddleware = require('~/middlewares/auth.middleware');

module.exports = (app) => {
	app.get('/', (req, res) => {
		res.sendStatus(200);
	});

	// Middlewares
	router.use(authMiddleware);

	// Routes
	rewardRoutes(router);
	authRoutes(router);
	userRoutes(router);

	app.use('/api', router);
};