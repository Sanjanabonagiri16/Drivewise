const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming User is the model for instructors
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming User is the model for clients
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;