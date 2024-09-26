// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express'); // Web framework for Node.js
const jwt = require('jsonwebtoken'); // Library for JSON Web Tokens

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Sample posts data (normally this would come from a database)
const posts = [
  {
    username: 'Kyle',
    title: 'Post 1' // Example post for user Kyle
  },
  {
    username: 'Jim',
    title: 'Post 2' // Example post for user Jim
  }
];

// GET endpoint to retrieve posts for the authenticated user
app.get('/posts', authenticateToken, (req, res) => {
  // Filter posts to only include those by the authenticated user
  res.json(posts.filter(post => post.username === req.user.name));
});

// Middleware function to authenticate tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Get the authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from header
  if (token == null) return res.sendStatus(401); // Unauthorized if no token is provided

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token verification fails
    req.user = user; // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  });
}

// Start the Express server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000'); // Log server start message
});
