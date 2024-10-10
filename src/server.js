const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const routes = require('./routes');
const serverless = require('serverless-http'); // for AWS Lambda

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Use routes
app.use('/', routes);

// Export the app for AWS Lambda
module.exports.handler = serverless(app);