const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Sample data for lessons and bookings
let lessons = [
    {
        id: 1,
        schoolId: 1,
        date: '2024-08-15',
        time: '10:00',
        available: true
    },
    {
        id: 2,
        schoolId: 1,
        date: '2024-08-15',
        time: '11:00',
        available: true
    },
    {
        id: 3,
        schoolId: 2,
        date: '2024-08-16',
        time: '09:00',
        available: true
    }
];

let bookings = [
    {
        id: 1,
        lessonId: 1,
        userId: 123
    }
];

app.use(express.json());

// Get available slots for a specific driving school
app.get('/api/lessons', (req, res) => {
    const { schoolId } = req.query;
    const availableLessons = lessons.filter(lesson => lesson.schoolId == schoolId && lesson.available);
    res.json(availableLessons);
});

// Book a lesson
app.post('/api/lessons/book', (req, res) => {
    const { lessonId, userId } = req.body;
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && lesson.available) {
        lesson.available = false;
        bookings.push({ lessonId, userId });
        res.status(200).send('Lesson booked successfully');
    } else {
        res.status(400).send('Lesson not available');
    }
});

// Get user's bookings
app.get('/api/bookings/:userId', (req, res) => {
    const userBookings = bookings.filter(b => b.userId === parseInt(req.params.userId));
    res.json(userBookings);
});

// Cancel a booking
app.post('/api/bookings/cancel', (req, res) => {
    const { lessonId, userId } = req.body;
    const index = bookings.findIndex(b => b.lessonId === lessonId && b.userId === userId);
    if (index !== -1) {
        bookings.splice(index, 1);
        const lesson = lessons.find(l => l.id === lessonId);
        if (lesson) lesson.available = true;
        res.status(200).send('Booking canceled successfully');
    } else {
        res.status(400).send('Booking not found');
    }
});

// Get all bookings (Admin feature)
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});