// backend/routes/notificationRoutes.js
const express = require('express');
const { sendEmailNotification } = require('../services/notificationService');
const router = express.Router();

// Route to send notifications
router.post('/send', async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        await sendEmailNotification(email, subject, message);
        res.status(200).json({ success: true, message: 'Notification sent successfully!' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
});

module.exports = router;