const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');

// Get the latest analytics data
router.get('/', async (req, res) => {
    try {
        const analytics = await Analytics.getLatestAnalytics();
        if (!analytics) {
            return res.status(404).json({ message: 'No analytics data found.' });
        }
        res.json(analytics);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create or update analytics data
router.post('/', async (req, res) => {
    const { totalUsers, lessonsConducted, lessonCompletionRate, totalRevenue } = req.body;

    try {
        // Check if analytics data already exists
        let analytics = await Analytics.getLatestAnalytics();
        
        if (analytics) {
            // Update existing analytics
            analytics.totalUsers = totalUsers || analytics.totalUsers;
            analytics.lessonsConducted = lessonsConducted || analytics.lessonsConducted;
            analytics.lessonCompletionRate = lessonCompletionRate || analytics.lessonCompletionRate;
            analytics.totalRevenue = totalRevenue || analytics.totalRevenue;

            await analytics.save();
            return res.json(analytics);
        } else {
            // Create new analytics record
            analytics = new Analytics({
                totalUsers,
                lessonsConducted,
                lessonCompletionRate,
                totalRevenue
            });

            await analytics.save();
            res.status(201).json(analytics);
        }
    } catch (error) {
        console.error('Error saving analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;