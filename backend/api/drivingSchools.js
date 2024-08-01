const express = require('express');
const router = express.Router(); // Create a new Router instance

// Sample data
const drivingSchools = [
    {
        id: 1,
        name: "Safe Driving School",
        location: "New York, NY",
        latitude: 40.7128,
        longitude: -74.0060,
        rating: 4.5,
        price: 50,
        services: ["Basic Driving Lessons", "Defensive Driving"],
        instructors: [{ name: "John Doe", experience: 5 }],
        reviews: [{ comment: "Great experience!", rating: 5 }]
    },
    {
        id: 2,
        name: "Fast Track Driving School",
        location: "Los Angeles, CA",
        latitude: 34.0522,
        longitude: -118.2437,
        rating: 4.0,
        price: 60,
        services: ["Advanced Driving Lessons", "Night Driving"],
        instructors: [{ name: "Jane Smith", experience: 8 }],
        reviews: [{ comment: "Very professional.", rating: 4 }]
    }
];

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// API endpoints
router.get('/', (req, res) => {
    const { location, rating, price, latitude, longitude, sortBy, page = 1, limit = 10 } = req.query;
    let filteredSchools = drivingSchools;

    // Calculate distance if latitude and longitude are provided
    if (latitude && longitude) {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        filteredSchools = filteredSchools.map(school => {
            const distance = calculateDistance(lat, lon, school.latitude, school.longitude);
            return { ...school, distance };
        });

        // Sort based on the specified criteria
        if (sortBy === 'distance') {
            filteredSchools.sort((a, b) => a.distance - b.distance);
        } else if (sortBy === 'rating') {
            filteredSchools.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'price') {
            filteredSchools.sort((a, b) => a.price - b.price);
        }
    }

    // Filter by location
    if (location) {
        filteredSchools = filteredSchools.filter(school => school.location.toLowerCase().includes(location.toLowerCase()));
    }
    // Filter by rating
    if (rating) {
        const minRating = parseFloat(rating);
        filteredSchools = filteredSchools.filter(school => school.rating >= minRating);
    }
    // Filter by price
    if (price) {
        const maxPrice = parseFloat(price);
        filteredSchools = filteredSchools.filter(school => school.price <= maxPrice);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSchools = filteredSchools.slice(startIndex, endIndex);

    res.json({
        schools: paginatedSchools,
        totalPages: Math.ceil(filteredSchools.length / limit),
        currentPage: parseInt(page),
        totalSchools: filteredSchools.length
    });
});

// Get a specific school by ID
router.get('/:id', (req, res) => {
    const school = drivingSchools.find(s => s.id === parseInt(req.params.id));
    if (school) {
        res.json(school);
    } else {
        res.status(404).json({ error: 'School not found' });
    }
});

// Add a new school (optional enhancement)
router.post('/', (req, res) => {
    const newSchool = req.body;
    newSchool.id = drivingSchools.length + 1; // Simple ID assignment
    drivingSchools.push(newSchool);
    res.status(201).json(newSchool);
});

module.exports = router; // Export the router