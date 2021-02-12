// Libraries
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

// Environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Setup
const { storage, fileFilter } = require('~/setup/storage');
const resHeaders = require('~/setup/response-headers');
const swagger = require('~/setup/swagger');
const database = require('~/setup/database');
const routes = require('~/setup/routes');

// Utils
const { errorHandler } = require('~/utils/helpers/error-handler');

// Express
const app = express();

// Parser
app.use(bodyParser.json());

// Multer
app.use(multer({ 
	storage, 
	fileFilter 
}).single('imageUrl'));

// Response headers
resHeaders(app);

// Swagger
swagger(app);

// App routes
routes(app);

// Error handler
app.use(errorHandler);

// Database
database(app);
