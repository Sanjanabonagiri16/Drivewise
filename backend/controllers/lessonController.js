const getLessons = (req, res) => {
    // Logic to get lessons
    res.json({ message: 'Get lessons' });
};

const bookLesson = (req, res) => {
    // Logic to book a lesson
    res.json({ message: 'Book a lesson' });
};

module.exports = { getLessons, bookLesson };
