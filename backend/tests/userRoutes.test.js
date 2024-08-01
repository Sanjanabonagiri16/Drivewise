const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    await User.deleteMany(); // Clear the User collection before each test
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
                email: `newuser_${Date.now()}@example.com`, // Ensure unique email
                password: 'password123',
                role: 'client',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    it('should login a user', async () => {
        // First, register a user
        const registerResponse = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Test User',
                email: `test_${Date.now()}@example.com`, // Ensure unique email
                password: 'password123',
                role: 'client',
            });

        // Check if registration was successful
        expect(registerResponse.statusCode).toEqual(201);
        expect(registerResponse.body.success).toBe(true);
        expect(registerResponse.body.token).toBeDefined();

        // Now, login with the same user
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                email: registerResponse.body.email, // Use the email from registration
                password: 'password123', // Use the same password
            });

        // Log the response for debugging
        if (loginResponse.status !== 200) {
            console.error('Login failed:', loginResponse.body); // Log the error response
        }

        expect(loginResponse.statusCode).toEqual(200);
        expect(loginResponse.body.success).toBe(true);
        expect(loginResponse.body.token).toBeDefined();
    });
});