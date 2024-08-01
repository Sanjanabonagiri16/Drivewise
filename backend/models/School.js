const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 }, // Added validation for rating
    comment: { type: String, required: true } // Made comment required
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const InstructorSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Made name required
    experience: { type: Number, required: true, min: 0 } // Added validation for experience
});

const SchoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 }, // Added validation for rating
    price: { type: Number, required: true, min: 0 }, // Added validation for price
    services: { type: [String], default: [] }, // Default to an empty array
    instructors: { type: [InstructorSchema], default: [] }, // Use InstructorSchema
    reviews: { type: [ReviewSchema], default: [] } // Use ReviewSchema
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const School = mongoose.model('School', SchoolSchema);

module.exports = School;