const express = require('express');
const router = express.Router();
const School = require('../models/School'); // Assuming you have a School model

// GET /api/driving-schools
router.get('/driving-schools', async (req, res) => {
    try {
        const { search, rating, price, sortBy, page = 1, limit = 10 } = req.query;

        // Build the query
        const query = {};
        if (search) {
            query.location = { $regex: search, $options: 'i' }; // Case-insensitive regex search
        }
        if (rating) {
            query.rating = { $gte: Number(rating) }; // Rating should be greater than or equal to specified rating
        }
        if (price) {
            query.price = { $lte: Number(price) }; // Price should be less than or equal to specified price
        }

        // Execute the query
        const schools = await School.find(query)
            .sort(sortBy || 'name') // Default sort by name if no sortBy is provided
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Get total count for pagination
        const totalCount = await School.countDocuments(query);

        res.json({
            schools,
            page: Number(page),
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
        });
    } catch (error) {
        console.error('Error fetching schools:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; // Export the router