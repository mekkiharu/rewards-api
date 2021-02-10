// Libraries
const corsMiddleware = require('cors');

module.exports = (app) => {
	// allows client origin only if not in development
	const allowedOrigins = process.env.NODE_ENV === 'development' ? '*' : process.env.CLIENT_ORIGIN;
	
	const cors = corsMiddleware({
		maxAge: 5,
		origins: allowedOrigins,
		allowHeaders: ['Authorization'],
	});

	app.use(cors);
};