const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res) => {
    const { userId, amount, paymentMethod } = req.body;

    const result = await paymentService.processPayment(userId, amount, paymentMethod);
    if (result.success) {
        // Save payment details to the database if needed
        return res.status(200).json({ success: true, message: 'Payment successful!' });
    } else {
        return res.status(400).json({ success: false, message: result.message });
    }
};