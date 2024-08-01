const request = require('supertest');
const app = require('../server'); // Adjust the path as necessary
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel');
const bcrypt = require('bcryptjs'); // Ensure password hashing

let token;
let userId;

beforeAll(async () => {
    // Connect to the database before running tests
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    // Clear the User and Payment collections before each test
    await User.deleteMany();
    await Payment.deleteMany();

    // Create a test user with a hashed password
    const password = await bcrypt.hash('password123', 10);
    const user = await new User({
        name: 'Test User',
        email: `test_${Date.now()}@example.com`, // Unique email for each test
        password, // Store the hashed password
        role: 'client',
    }).save();
    userId = user._id;

    // Log in to get a token
    const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: user.email,
            password: 'password123',
        });

    if (loginResponse.status !== 200) {
        console.error('Login failed:', loginResponse.body);
    }

    token = loginResponse.body.token; // Store the token for later use
});

afterEach(async () => {
    // Clear the User and Payment collections after each test
    await User.deleteMany();
    await Payment.deleteMany();
});

afterAll(async () => {
    await mongoose.disconnect(); // Close the database connection after all tests
});

describe('User API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'New User',
                email: `new_${Date.now()}@example.com`, // Unique email
                password: 'password123',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        const user = await new User({
            name: 'Test User for Login',
            email: `login_${Date.now()}@example.com`,
            password: await bcrypt.hash('password123', 10),
            role: 'client',
        }).save();

        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: user.email,
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});

describe('Payment API', () => {
    it('should create a new payment', async () => {
        const res = await request(app)
            .post('/api/payments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: userId, // Use the userId from beforeEach setup
                amount: 100,
                description: 'Test payment',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('payment');
    });

    // Add more payment-related tests as needed
});
