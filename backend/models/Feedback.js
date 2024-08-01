// backend/models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    lessonId: { type: String, required: true }, // Reference to the lesson
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);