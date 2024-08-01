const express = require('express');
const router = express.Router();
const Payment = require('../models/paymentModel');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new payment
router.post('/', authMiddleware, async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const newPayment = new Payment({ userId, amount });
        await newPayment.save();
        res.status(201).json({ success: true, payment: newPayment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get payment history for a user
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.params.userId });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;