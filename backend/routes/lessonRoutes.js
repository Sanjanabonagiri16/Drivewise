const express = require('express');
const router = express.Router();
const Lesson = require('../models/lessonModel');
const authMiddleware = require('../middleware/authMiddleware');
const { getLessons, bookLesson } = require('../controllers/lessonController');
const { sendEmailNotification } = require('../services/notificationService');

router.get('/', getLessons);
router.post('/book', bookLesson);

// Create a new lesson
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, time } = req.body;

    if (!title || !description || !time) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const newLesson = new Lesson({ title, description, time });
        await newLesson.save();
        res.status(201).json({ success: true, lesson: newLesson });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get all lessons for a user
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const lessons = await Lesson.find({
            $or: [
                { instructorId: req.params.userId },
                { clientId: req.params.userId }
            ]
        });
        res.json({ success: true, lessons });
    } catch (error) {
        console.error('Error fetching lessons:', error); // Log the error for debugging
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update a lesson
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
        res.json({ success: true, lesson });
    } catch (error) {
        console.error('Error updating lesson:', error); // Log the error for debugging
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete a lesson
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
        res.json({ success: true, message: 'Lesson deleted' });
    } catch (error) {
        console.error('Error deleting lesson:', error); // Log the error for debugging
        res.status(400).json({ success: false, message: error.message });
    }
});

// Example route to schedule a lesson
router.post('/schedule', async (req, res) => {
    const { email, lessonDetails } = req.body;

    // Logic to schedule the lesson...

    // Send notification
    const subject = 'Lesson Scheduled';
    const message = `Your lesson has been scheduled: ${lessonDetails}`;
    await sendEmailNotification(email, subject, message);

    res.status(200).json({ success: true, message: 'Lesson scheduled and notification sent!' });
});

module.exports = router;