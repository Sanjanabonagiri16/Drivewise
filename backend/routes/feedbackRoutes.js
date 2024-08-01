// backend/routes/feedbackRoutes.js
const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Submit feedback
router.post('/submit', async (req, res) => {
    const { studentName, lessonId, rating, comment } = req.body;

    try {
        const feedback = new Feedback({ studentName, lessonId, rating, comment });
        await feedback.save();
        res.status(201).json({ success: true, message: 'Feedback submitted successfully!' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
});

// Get feedback for a specific lesson
router.get('/:lessonId', async (req, res) => {
    const { lessonId } = req.params;

    try {
        const feedbacks = await Feedback.find({ lessonId });
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
});

module.exports = router;