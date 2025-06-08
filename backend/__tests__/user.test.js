const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');


beforeEach(async () => {
    // Clear the User collection before each test
    await User.deleteOne({ email: 'test@example.com' });
});

// Connecting to MongoDB before all tests

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => {console.log("Connection to MongoDB established for Jest")},
    err => { console.log("Failed to connect to MongoDB for Jest", err) }
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe('User API Tests', () => {

    it('POST /api/user/register - should register a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                fullName: 'Test User',
                phone: '1234567890',
                address: '123 Test St, Test City, TC 12345'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe(' User created successfully');
    }, 10000);
});
