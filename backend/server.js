const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const auth = require('./middleware/authMiddleware'); // Authentication middleware
const paymentRoutes = require('./services/paymentService'); // Import the payment routes
const webhookRoutes = require('./routes/webhookRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes'); // Import feedback routes
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import analytics routes
const notificationRoutes = require('./routes/notificationRoutes'); // Import notification routes

const schoolRoutes = require('./routes/schoolRoutes'); // Import school routes

app.use('/api', schoolRoutes); // Use the school routes


const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Adjust to your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files
const publicPath = path.join(__dirname, '..', 'public'); // Adjust this path if necessary
app.use(express.static(publicPath));

// Use routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes); // Now this is correctly placed
app.use('/api/notifications', notificationRoutes);
app.use('/api', paymentRoutes); // Use the payment routes
app.use('/api/webhooks', webhookRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/drivewise', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.redirect('/premium.html');
});

// User routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});