const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const Device = require('../src/models/device.model');
const { generateToken } = require('../src/services/auth.service');

let token;
let user;
let testDeviceId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(
        () => { console.log("Connection to MongoDB established for Jest") },
        err => { console.log("Failed to connect to MongoDB for Jest", err) }
        );
    
    user = {
        _id: new mongoose.Types.ObjectId().toString(),
        email: 'test@email.com',
        fullName: 'Test User',
        role: 'ADMIN'
    }
    token = generateToken(user)
});

afterAll(async () => {
    await Device.deleteMany({ user: user._id });
    await mongoose.connection.close();
});


describe('POST /api/devices - create devices', () => {

    it('should create a new manual device successfully', async () => {
            const res = await request(app)
                .post('/api/devices')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    type: 'light',
                    name: 'Living Room Light',
                    mode: 'manual',
                    powerWatts: 60,
                    location: 'living-room'
                });
        
            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe('Device created successfully');
    })

    it('should create a new always-on device and set isActive to true and alwaysOnActivatedAt', async () => {
        const res = await request(app)
            .post('/api/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'fridge',
                name: 'Kitchen Fridge',
                mode: 'always-on',
                powerWatts: 150,
                location: 'kitchen'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe(true);
        expect(res.body.device.mode).toBe('always-on');
        expect(res.body.device.isActive).toBe(true);

    });

    
    it('should create a new daily-fixed device with schedule', async () => {
        const res = await request(app)
            .post('/api/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'heater',
                name: 'Bedroom Heater',
                mode: 'daily-fixed',
                powerWatts: 2000,
                dailyFixedSchedule: {
                    startTime: '08:00',
                    endTime: '10:00'
                },
                location: 'bedroom'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe(true);
        expect(res.body.device.mode).toBe('daily-fixed');
        expect(res.body.device.dailyFixedSchedule.startTime).toBe('08:00');
        expect(res.body.device.dailyFixedSchedule.endTime).toBe('10:00');

    });

    it('should return 400 if device type is missing', async () => {
        const res = await request(app)
            .post('/api/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Missing Type Device',
                mode: 'manual',
                powerWatts: 50
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Device type is required');
    });


    it('should return 400 if device mode is missing', async () => {
        const res = await request(app)
            .post('/api/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'fan',
                name: 'Missing Mode Device',
                powerWatts: 50
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Device mode is required');
    });


    it('should return 400 if powerWatts is missing', async () => {
        const res = await request(app)
            .post('/api/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'fan',
                name: 'Missing Power Device',
                mode: 'manual'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Consumption per hour is required');
    });


    it('should return 400 if dailyFixedSchedule is missing for daily-fixed mode', async () => {
        const res = await request(app)
            .post('/api/devices')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'heater',
                name: 'No Schedule Heater',
                mode: 'daily-fixed',
                powerWatts: 1000
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Daily schedule is required for daily-fixed mode');
    });

});

describe('GET /api/devices - get all devices', () => {
    it('should get all devices', async () => {
        const res = await request(app)
        .get('/api/devices')
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true); 
    }) 

});


describe('GET /api/devices/:id - get device by ID', () => {

    let device;

    beforeEach(async () => {
        await Device.deleteMany({ user: user._id });
        // Δημιουργία συσκευής για τον test user
        device = await Device.create({
            deviceId: 'dev-003',
            type: 'tv',
            name: 'Living Room TV',
            mode: 'manual',
            powerWatts: 100,
            user: user._id
        })
    })


    it('should return the device info for the authenticated user', async () => {
        const res = await request(app)
            .get(`/api/devices/${device._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.device._id.toString()).toBe(device._id.toString());
        expect(res.body.device.name).toBe('Living Room TV');
    });

    it('should return 404 if device not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/devices/${fakeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Device not found');
    });
})




describe('PUT /api/devices/:id - update device by ID', () => {
    let device;

    beforeEach( async () => {
        await Device.deleteMany({ user: user._id });

        device = await Device.create({
            deviceId: 'dev-update-001',
            type: 'light',
            name: 'Old Light Name',
            mode: 'manual',
            powerWatts: 50,
            user: user._id
        });
    });

    it('should update a device successfully', async () => {
        const updatedData = {
            name: 'New Light Name',
            powerWatts: 75,
            location: 'bedroom'
        };

        const res = await request(app)
            .put(`/api/devices/${device._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.device.name).toBe('New Light Name');
        expect(res.body.device.powerWatts).toBe(75);
        expect(res.body.device.location).toBe('bedroom');
    });

    it('should update mode to always-on and set isActive and alwaysOnActivatedAt', async () => {
        const updatedData = {
            mode: 'always-on',
            name: 'New Always-On Fridge',
            powerWatts: 180
        };

        const res = await request(app)
            .put(`/api/devices/${device._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.device.mode).toBe('always-on');
        expect(res.body.device.isActive).toBe(true);
        expect(res.body.device.alwaysOnActivatedAt).not.toBeNull();
    });


    it('should update mode to daily-fixed and require schedule', async () => {
        const updatedData = {
            mode: 'daily-fixed',
            name: 'New Daily-Fixed Heater',
            powerWatts: 2500,
            dailyFixedSchedule: {
                startTime: '07:00',
                endTime: '09:00'
            }
        };

        const res = await request(app)
            .put(`/api/devices/${device._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.device.mode).toBe('daily-fixed');
        expect(res.body.device.dailyFixedSchedule.startTime).toBe('07:00');
        expect(res.body.device.dailyFixedSchedule.endTime).toBe('09:00');
    });


    it('should return 400 if dailyFixedSchedule is missing when updating to daily-fixed mode', async () => {
        const updatedData = {
            mode: 'daily-fixed',
            name: 'Missing Schedule Heater',
            powerWatts: 1000
        };

        const res = await request(app)
            .put(`/api/devices/${device._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Daily schedule is required for daily-fixed mode');
    });


    it('should return 404 if device not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/api/devices/${fakeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Non Existent Device' });

        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Device not found');
    });

})


describe('DELETE - /api/devices/:id - delete a device by ID', () => {
    let device;

    beforeEach( async () => {
        await Device.deleteMany({ user: user._id });

        device = await Device.create({
            deviceId: 'dev-delete-001',
            type: 'speaker',
            name: 'Speaker to Delete',
            mode: 'manual',
            powerWatts: 30,
            user: user._id
        });
    });

    it('should delete a device successfully', async () => {
        const res = await request(app)
            .delete(`/api/devices/${device._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Device deleted');
    });

    it('should return 404 if device not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/devices/${fakeId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Device not found');
    });

})


describe('PATH /api/devices/:id/toggle - toggle manual device', () => {
    let device;

    beforeEach( async () => {
        await Device.deleteMany({ user: user._id});

        device = await Device.create({
            deviceId: 'manual-dev-001',
            type: 'lamp',
            name: 'Manual Lamp',
            mode: 'manual',
            powerWatts: 50,
            isActive: false,
            user: user._id
        });
    });

    it('should turn ON a manual device', async () => {
        const res = await request(app)
            .patch(`/api/devices/${device._id}/toggle`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Device turned ON');

        const updatedDevice = await Device.findById(device._id);
        expect(updatedDevice.isActive).toBe(true);
        expect(updatedDevice.manualActivatedAt).not.toBeNull();
    });

    it('should turn OFF a manual device', async () => {

        device.isActive = true;
        device.manualActivatedAt = new Date(Date.now() - 3600 * 1000); 
        await device.save();

        const res = await request(app)
            .patch(`/api/devices/${device._id}/toggle`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('Device turned OFF and usage recorded!');

        const updatedDevice = await Device.findById(device._id);
        expect(updatedDevice.isActive).toBe(false);
    })

    it('should return 404 if device not found', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .patch(`/api/devices/${fakeId}/toggle`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe(false);
        expect(res.body.message).toBe('Device not found');
    });

})


describe('DELETE /api/devices - delete all devices', () => {
    beforeEach(async () => {
        await Device.deleteMany({ user: user._id }); 
        await Device.create({
            deviceId: 'del-all-001',
            type: 'lamp',
            name: 'Lamp 1',
            mode: 'manual',
            powerWatts: 40,
            user: user._id
        });
        await Device.create({
            deviceId: 'del-all-002',
            type: 'fan',
            name: 'Fan 1',
            mode: 'manual',
            powerWatts: 60,
            user: user._id
        });
    });

    it('should delete all devices for the authenticated user', async () => {
        const res = await request(app)
            .delete('/api/devices')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
        expect(res.body.message).toBe('All devices deleted successfully');
        const remainingDevices = await Device.find({ user: user._id });
        expect(remainingDevices).toHaveLength(0);
    });

});