const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const router = express.Router();

// List of authorized email domains
const authorizedDomains = ['example.com', 'yourdomain.com']; // Add your authorized domains here

// Function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    const domain = email.split('@')[1];
    return emailRegex.test(email) && authorizedDomains.includes(domain);
};

// User Registration
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate input fields
    if (!name || !email || !password || !role) {
        console.log('Validation error: missing fields');
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate email
    if (!isValidEmail(email)) {
        console.log('Validation error: invalid email');
        return res.status(400).json({ success: false, message: 'Invalid email address. Only authorized emails are allowed.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Validation error: email already in use');
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Generate an authentication token
        const token = newUser.generateAuthToken(); // Ensure this method exists in your User model
        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        console.log('Validation error: missing fields');
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Validate email
    if (!isValidEmail(email)) {
        console.log('Validation error: invalid email');
        return res.status(400).json({ success: false, message: 'Invalid email address. Only authorized emails are allowed.' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Validation error: invalid email or password');
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Validation error: invalid email or password');
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Generate an authentication token
        const token = user.generateAuthToken(); // Ensure this method exists in your User model
        res.json({ success: true, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router; // Export the router