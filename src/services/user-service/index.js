const express = require('express');

const app = express();
app.use(express.json());

// In-memory user profile storage
let userProfiles = [];

// User Routes
app.get('/users/:userId/profile', authenticateToken, (req, res) => {
    const profile = userProfiles.find(p => p.userId === req.params.userId);
    res.json(profile);
});
