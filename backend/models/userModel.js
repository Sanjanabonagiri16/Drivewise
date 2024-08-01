const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        lowercase: true, // Convert email to lowercase
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['client', 'instructor'], // Only allow these roles
        required: true,
    },
    schoolName: {
        type: String,
        required: function() { return this.role === 'instructor'; }, // Only required for instructors
    },
    schoolAddress: {
        type: String,
        required: function() { return this.role === 'instructor'; }, // Only required for instructors
    },
    experience: {
        type: Number,
        required: function() { return this.role === 'instructor'; }, // Only required for instructors
    },
    clientAddress: {
        type: String,
        required: function() { return this.role === 'client'; }, // Only required for clients
    },
    clientPhone: {
        type: String,
        required: function() { return this.role === 'client'; }, // Only required for clients
    },
});

// Method to generate authentication token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Method to hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Static method for login
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }

    return user;
};

// Method to validate email
userSchema.statics.isValidEmail = function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    const authorizedDomains = ['example.com', 'yourdomain.com']; // Add your authorized domains here
    const domain = email.split('@')[1];
    return emailRegex.test(email) && authorizedDomains.includes(domain);
};

const User = mongoose.model('User', userSchema);

module.exports = User;