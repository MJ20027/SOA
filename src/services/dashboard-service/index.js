const express = require('express');

const app = express();
app.use(express.json());

// Dashboard Routes
app.get('/dashboard/analytics', authenticateToken, (req, res) => {
    res.json({
        metrics: {
            totalEvents: events.length,
            totalUsers: users.length,
            recentEvents: events.slice(-5)
        }
    });
});
