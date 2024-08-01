const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');
const Lesson = require('../models/lessonModel');
const mongoose = require('mongoose');
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
    // Clear the User and Lesson collections before each test
    await User.deleteMany();
    await Lesson.deleteMany();

    // Create a test user with a hashed password
    const password = await bcrypt.hash('password123', 10);
    const user = await new User({
        name: 'Test User',
        email: `test_${Date.now()}@example.com`,
        password, // Store the hashed password
        role: 'instructor',
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

    token = loginResponse.body.token;
});

afterEach(async () => {
    // Clear the User and Lesson collections after each test
    await User.deleteMany();
    await Lesson.deleteMany();
});

afterAll(async () => {
    await mongoose.disconnect(); // Close the database connection after all tests
});

describe('Lesson API', () => {
    it('should create a new lesson', async () => {
        const res = await request(app)
            .post('/api/lessons')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Lesson',
                description: 'Lesson Description',
                time: '10:00 AM',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
});
