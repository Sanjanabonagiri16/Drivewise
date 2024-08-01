const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure password hashing

let token;
let userId;
let instructorId;

beforeAll(async () => {
    // Connect to the database before running tests
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    await User.deleteMany(); // Clear the User collection before each test
    await Review.deleteMany(); // Clear the Review collection before each test

    // Create a test user with a hashed password
    const password = await bcrypt.hash('password123', 10);
    const user = await new User({
        name: 'Test User',
        email: `test_${Date.now()}@example.com`,
        password, // Store the hashed password
        role: 'client',
    }).save();
    userId = user._id;

    // Create a test instructor
    const instructor = await new User({
        name: 'Instructor User',
        email: `instructor_${Date.now()}@example.com`,
        password, // Use the same hashed password for simplicity
        role: 'instructor',
    }).save();
    instructorId = instructor._id;

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

afterAll(async () => {
    await mongoose.disconnect(); // Close the database connection after all tests
});

describe('Review API', () => {
    it('should create a new review', async () => {
        const res = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({
                instructorId,
                clientId: userId,
                rating: 5,
                comment: 'Great instructor!',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('review');
        expect(res.body.review).toHaveProperty('rating', 5);
        expect(res.body.review).toHaveProperty('comment', 'Great instructor!');
    });

    it('should fetch reviews for an instructor', async () => {
        // First, create a review
        await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({
                instructorId,
                clientId: userId,
                rating: 5,
                comment: 'Great instructor!',
            });

        // Then, fetch the reviews
        const res = await request(app)
            .get(`/api/reviews/instructor/${instructorId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('reviews');
        expect(res.body.reviews.length).toBe(1);
        expect(res.body.reviews[0]).toHaveProperty('rating', 5);
        expect(res.body.reviews[0]).toHaveProperty('comment', 'Great instructor!');
    });

    it('should fetch reviews by a user', async () => {
        // First, create a review
        await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({
                instructorId,
                clientId: userId,
                rating: 5,
                comment: 'Great instructor!',
            });

        // Then, fetch the reviews
        const res = await request(app)
            .get(`/api/reviews/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('reviews');
        expect(res.body.reviews.length).toBe(1);
        expect(res.body.reviews[0]).toHaveProperty('rating', 5);
        expect(res.body.reviews[0]).toHaveProperty('comment', 'Great instructor!');
    });
});
