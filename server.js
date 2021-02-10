// Libraries
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

// Environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Setup
const { fileStorage, fileFilter } = require('~/setup/storage');
const resHeaders = require('~/setup/response-headers');
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
	storage: fileStorage, 
	fileFilter 
}).single('imageUrl'));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Response headers
resHeaders(app);

// App routes
routes(app);

// Error handler
app.use(errorHandler);

// Database
database(app);
