const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcrypt')

let userId; // global for usage at all describe blocks
// Connecting to MongoDB before all tests
// create a public accessible user for the test
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => {console.log("Connection to MongoDB established for Jest")},
    err => { console.log("Failed to connect to MongoDB for Jest", err) }
  );

  const hashedPw = await bcrypt.hash('password123', 10)
  const user = new User({
    email: 'test@example.com',
    password: hashedPw,
    fullName: 'Test User',
    phone: '1234567890',
    address: '123 Test, Test, TK 12345'
  });

  const savedUser = await user.save();
  userId = savedUser._id;
});


afterAll(async () => {
    // Clear the User collection after all tests
    await User.deleteMany({ email: 'test@example.com' });
    await User.deleteMany({ email: 'updateduser@example.com'});
    await mongoose.connection.close();
});


describe('POST /api/users - user registration', () => {
  it('should create a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        email: 'newuser@example.com',
        password: 'securepassword',
        fullName: 'Test New',
        phone: '2109999999',
        address: '1 Testing Street, Athens'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe(' User created successfully');

    await User.deleteOne({ email: 'newuser@example.com'})
  });

  it('should fail if user already exists', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',  
        password: 'anyPassword123',
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test, Test, TK 12345'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe('User already exists');
  })

  it('should fail if email is missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        email: '',  
        password: 'anyPassword123',
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test, Test, TK 12345'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Email and password are required");
  })

  it('should fail if password is missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        email: 'missingpw@example.com',  
        password: '',
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test, Test, TK 12345'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Email and password are required");
  })

  it('should fail if email wrong format', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        email: 'fasfdasexample.com',  
        password: '1234123412asdfas',
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test, Test, TK 12345'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Invalid email format");
  });

  it('should fail if password less than 6 chars', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        email: 'missingpw@example.com',  
        password: '12345',
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test, Test, TK 12345'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Password must be at least 6 characters long");
  });

  

})

describe('GET /api/users/:id - show user info ', () => {

  it('should return the user info with _id === req.params.id ', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should return 404 if user not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/users/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe('User not found');
  });

});

describe('PUT /api/users/:id - update user', () => {

  it('should update the user with _id === req.params.id ', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        email: 'updateduser@example.com',
        fullName: 'Updated Name',
        phone: '2108888888',
        address: 'Updated Street'
      })

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.user.email).toBe('updateduser@example.com');
    expect(res.body.message).toBe('User updated successfully');
  });

  it('should return 400 if not email', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({
      email: '',
      fullName: 'User 404',
      phone: '0000000000',
      address: '404'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe('Email and full name are required');
  });

  it('should return 400 if not full name', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({
      email: 'test@example.com',
      fullName: '',
      phone: '0000000000',
      address: '404'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe('Email and full name are required');
  });

  it('should fail if email wrong format', async () => {
    const res = await request(app)
      .put('/api/users/${userId}')
      .send({
        email: 'fasfdasexample.com',  
        password: '1234123412asdfas',
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test, Test, TK 12345'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Invalid email format");
  });

  it('should return 404 if user not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/users/${fakeId}`)
      .send({
      email: 'user404@example.com',
      fullName: 'User 404',
      phone: '0000000000',
      address: '404'
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe('User not found');
  });

});

describe('DELETE /api/users/:id - delete user', () => {
  
  it('should delete the user with _id === req.params.id', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe('User deleted successfully');
  })

  it('should return 404 if user not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/users/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe('User not found');
  });
})

 