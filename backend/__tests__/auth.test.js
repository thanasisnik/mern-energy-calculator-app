const request = require('supertest');
const mongoose = require("mongoose");


// const authSer

const app = require('../src/app'); 


// Connecting to MongoDB before each test
beforeEach(async ()=> {
  await mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => {console.log("Connection to MongoDB established for Jest")},
    err => { console.log("Failed to connect to MongoDB for Jest", err) }
  );
});

// Close connection to MongoDB
afterEach(async ()=>{
  await mongoose.connection.close();
});

describe('Auth Login Endpoint', () => {
    it('should return 404 for invalid credentials', async () => {
        const res = await request(app).post('/api/auth/login')
            .send({
                email: 'test@email.gr',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Invalid email or password');
    }, 10000)
});

describe('Auth Login Endpoint with valid credentials', () => {
    it('should return 200 for valid credentials', async () => {
        const res = await request(app).post('/api/auth/login')
            .send({
                email: 'xxxx@email.com',
                password: '123456'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Login successful');
    }, 10000)
})

// 