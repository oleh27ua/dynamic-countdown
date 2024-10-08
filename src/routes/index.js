const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the main page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Serve the calendar page
router.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/calendar.html'));
});

// Handle 404 errors
router.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../../public/404.html'));
});

module.exports = router;