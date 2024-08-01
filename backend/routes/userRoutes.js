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
    const { name, email, password, role, clientAddress, clientPhone } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate email
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address. Only authorized emails are allowed.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            clientAddress: role === 'client' ? clientAddress : undefined,
            clientPhone: role === 'client' ? clientPhone : undefined,
        });
        await newUser.save();

        const token = newUser.generateAuthToken(); // Ensure this method exists in your User model
        res.status(201).json({ success: true, token, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Validate email
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address. Only authorized emails are allowed.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Login attempt with non-existent email:', email);
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login attempt with incorrect password for email:', email);
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = user.generateAuthToken(); // Ensure this method exists in your User model
        res.json({ success: true, token, user: { role: user.role } });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router; // Export the router