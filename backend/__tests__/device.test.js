const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const Device = require('../src/models/device.model');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(
        () => { console.log("Connection to MongoDB established for Jest") },
        err => { console.log("Failed to connect to MongoDB for Jest", err) }
        );
});

afterAll(async () => {
    await mongoose.connection.close();
});


describe('Device API Tests', () => {
    afterAll(async () => {
        //  Clear the device with the name 'Test Device' before each test
        await Device.deleteOne({ name: 'Test Device' });
    });

    // Test for creating a device
    it('POST /api/devices - should create a new device', async () => {
        const res = await request(app)
            .post('/api/devices')
            .send({
                type: 'Sensor',
                name: 'Test Device',
                mode: 'always-on',
                consumptionPerHour: '150',
                location: 'other'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Device created successfully');
    }, 10000);

    // Test for getting all devices
    it('GET /api/devices - should get all devices', async () => {
        const res = await request(app)
            .get('/api/devices');

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe(true);
    }, 10000);

    // Test for getting a device by ID
    it('GET /api/devices/:id - should get a device by ID', async () => {
        // First, create a device to get its ID
        const device = await Device.create({
            type: 'Sensor',
            name: 'Test Device',
            mode: 'always-on',
            consumptionPerHour: '150',
            location: 'other'
        });

        const res = await request(app)
            .get(`/api/devices/${device._id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe(true);
        expect(res.body.device.name).toBe('Test Device');
    }, 10000);

    // Test for updating a device by ID
    
});
