// Load environment variables from .env file
require('dotenv').config()

// Import required modules
const express = require('express'); // Web framework for Node.js
const jwt = require('jsonwebtoken'); // Library for JSON Web Tokens

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Array to hold refresh tokens
let refreshTokens = [];

// POST endpoint to generate a new access token using a refresh token
app.post('/token', (req, res) => {
  const refreshToken = req.body.token; // Get the refresh token from the request body
  if (refreshToken == null) return res.sendStatus(401); // Unauthorized if no token is provided
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); // Forbidden if token is not valid

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token verification fails
    const accessToken = generateAccessToken({ name: user.name }); // Generate a new access token
    res.json({ accessToken: accessToken }); // Send the access token as response
  });
});

// DELETE endpoint to logout and remove refresh token
app.delete('/logout', (req, res) => {
  // Remove the refresh token from the array
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204); // No content response
});

// POST endpoint for user login
app.post('/login', (req, res) => {
  // Authenticate User (this is where you would normally verify username/password)
  const username = req.body.username; // Get username from request body
  const user = { name: username }; // Create user object

  // Generate access and refresh tokens
  const accessToken = generateAccessToken(user); // Create an access token
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); // Create a refresh token
  refreshTokens.push(refreshToken); // Store refresh token for future use

  // Send both tokens in response
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// Function to generate an access token with a short expiration time
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' }); // Access token valid for 15 seconds
}

// Start the Express server on port 4000
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000'); // Log server start message
});
