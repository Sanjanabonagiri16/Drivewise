const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
    createdAt: { type: Date, default: Date.now }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;