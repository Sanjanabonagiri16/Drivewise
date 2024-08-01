const drivingSchoolsData = require('../api/drivingSchools'); // Import your sample data

const getDrivingSchools = (req, res) => {
    const { location, rating, price, latitude, longitude, sortBy, page = 1, limit = 10 } = req.query;
    
    let filteredSchools = drivingSchoolsData; // Use the sample data directly

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
};

const getDrivingSchoolById = (req, res) => {
    const schoolId = parseInt(req.params.id);
    const school = drivingSchoolsData.find(s => s.id === schoolId);
    
    if (school) {
        res.json(school);
    } else {
        res.status(404).json({ error: 'School not found' });
    }
};

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

module.exports = { getDrivingSchools, getDrivingSchoolById };
