// Import required modules
const express = require('express');
const path = require('path');

// Create Express app
const app = express();
const PORT = 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Optional: route for testing
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
