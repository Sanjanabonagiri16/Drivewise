const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new review
router.post('/', authMiddleware, async (req, res) => {
    const { instructorId, clientId, rating, comment } = req.body;

    if (!instructorId || !clientId || !rating || !comment) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const newReview = new Review({ instructorId, clientId, rating, comment });
        await newReview.save();
        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get reviews for an instructor
router.get('/instructor/:instructorId', async (req, res) => {
    try {
        const reviews = await Review.find({ instructorId: req.params.instructorId }).populate('clientId', 'name');
        res.json({ success: true, reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get reviews by a user
router.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ clientId: req.params.userId }).populate('instructorId', 'name');
        res.json({ success: true, reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;