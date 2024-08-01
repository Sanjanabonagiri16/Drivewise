// backend/models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    totalUsers: { type: Number, default: 0, min: 0 }, // Added min validation
    lessonsConducted: { type: Number, default: 0, min: 0 }, // Added min validation
    lessonCompletionRate: { type: Number, default: 0, min: 0, max: 100 }, // Added min/max validation
    totalRevenue: { type: Number, default: 0, min: 0 }, // Added min validation
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); // Enable timestamps

// Example static method to find the latest analytics
analyticsSchema.statics.getLatestAnalytics = function() {
    return this.findOne().sort({ createdAt: -1 });
};

module.exports = mongoose.model('Analytics', analyticsSchema);