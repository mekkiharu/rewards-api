// Libraries
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

module.exports = (app) => {
	const basePath = '/api';

	// add swagger definitions
	const version = '1.0';
	const title = 'Rewards API Documentation';
	const options = {
		explorer: true,
		swaggerDefinition: {
			openapi: '3.0.0', // specification (optional, defaults to swagger: '2.0')
			info: {
				title,
				description: 'Swagger API documentation of Rewards app.',
				version,
			},
			servers: [
				{
					url: `${basePath}`
				},
			],
		},
		// path to the API docs
		apis: ['./routes/*.route.js', './swagger/**/*.yml'],
	};

	// UI
	const swaggerSpec = swaggerJSDoc(options);
	app.use('/api/api-docs', 
		swaggerUI.serve, 
		swaggerUI.setup(swaggerSpec, { customSiteTitle: title, })
	);

	// JSON format
	app.get('/api/api-docs.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});
}