const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const routes = require('./routes');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Set the views directory
app.set('views', path.join(__dirname, './views'));

// Use routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});