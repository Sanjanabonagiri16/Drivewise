const express = require('express'); // Import express
const router = express.Router(); // Create a new router instance

// Import the payment service implementation
const PaymentService = require('./paymentServiceImplementation'); // Ensure this path is correct

// Payment route
router.post('/payments', async (req, res) => {
    const { userId, amount, paymentMethod } = req.body;

    try {
        // Validate input
        if (!userId || !amount || !paymentMethod) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        // Process payment using the payment service
        const paymentResult = await PaymentService.processPayment(userId, amount, paymentMethod);
        
        if (paymentResult.success) {
            // Respond with success
            return res.status(200).json({ success: true, message: 'Payment successful!' });
        } else {
            return res.status(400).json({ success: false, message: paymentResult.message });
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        return res.status(500).json({ success: false, message: 'Payment processing failed' });
    }
});

// Export the router to be used in server.js
module.exports = router;