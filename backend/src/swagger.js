const m2s = require('mongoose-to-swagger');
const User = require('./models/user.model');
const Device = require('./models/device.model');

exports.options = {
    "components": {
        "schemas": {
            User: m2s(User),
            Device: m2s(Device)
        }
    },
    "openapi":"3.1.0",
    "info": {
        "version": "1.0.0",
        "title": "Energy Consumption",
        "description": "An application to calculate the electric energy consumption",
        "contact": {
            "name": "API Support",
            "url": "https://test.gr",
            "email": "support@example.com"
        }
    },
    "servers": [
        {
            url:"http://localhost:3000",
            description: "Local Server"
        },
        {
            // url for production server
            
        }
    ],
    "components": {
        "schemas": {
            User: m2s(User),
            Device: m2s(Device)
        },
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        },
    },
    "tags": [
        {
            "name": "Users",
            "description": "Endpoints for User"
        },
        {
            "name": "Devices",
            "description": "Endpoints for Devices"
        },
        {
            "name": "Usage",
            "description": "Endpoints for usage"
        }
    ],
    "paths": {
        "/api/users/": {
            "post": {
                "tags":["Users"],
                "description": "Register a new user with hashed password",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/User"
                            },
                            "example": {
                                "email": "test@example.com",
                                "password": "test1234",
                                "fullName": "Test User",
                                "phone": "1234567890",
                                "address": "Test Street 33"
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Successful register",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "boolean"},
                                        "message": { "type": "string"}
                                    }
                                },
                                "example": {
                                    "status": true,
                                    "message": "User created successfully"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "content" : {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status" : {"type": "boolean"},
                                        "message": { "type": "string"}
                                    }
                                },
                                "example": {
                                    "status" : false,
                                    "message": "User already exists."
                                }
                            }
                        }
                    }
                }
            },
        },
        "/api/auth/login": {
            "post": {
                "tags": ["Users"],
                "description": "Login a user with email and password",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "email": { "type": "string", "format": "email" },
                                    "password": { "type": "string" }
                                }
                            },
                            "example": {
                                "email": "test@example.com",
                                "password": "test1234"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful login",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": { "type": "boolean" },
                                        "message": { "type": "string" },
                                        "token": { "type": "string" },
                                        "User": {
                                            "type": "object",
                                            "properties": {
                                                "_id": { "type": "string" },
                                                "fullName": { "type": "string" },
                                                "email": { "type": "string"}
                                            }
                                        }
                                    }
                                },
                                "example": {
                                    "status": true,
                                    "message": "Login successful",
                                    "token": "jwt.token.here",
                                    "User": {
                                        "_id": "123456",
                                        "fullName": "Test User",
                                        "email": "test@example.com",
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": { "type": "boolean" },
                                        "message": { "type": "string" }
                                    }
                                },
                                "example": {
                                    "status": false,
                                    "message": "Invalid email or password"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Get user by ID",
                description: "Returns a user's profile data (excluding password). Requires JWT authentication.",
                security: [
                {
                    bearerAuth: []
                }
                ],
                parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "User ID",
                    schema: { type: "string" }
                }
                ],
                responses: {
                200: {
                    description: "User found",
                    content: {
                    "application/json": {
                        example: {
                        status: true,
                        user: {
                            _id: "123456",
                            email: "user@example.com",
                            fullName: "User Name",
                            phone: "1234567890",
                            address: "Street Name 1",
                            "role": "admin",
                            "createdAt": "2025-07-01T00:00:00Z",
                            "updatedAt": "2025-07-01T00:00:00Z",
                            "__v":0

                        }
                        }
                    }
                    }
                },
                401: {
                    description: "Unauthorized - Missing or invalid token"
                },
                404: {
                    description: "User not found"
                }
                }
            },
            put: {
                tags: ["Users"],
                summary: "Update user by ID",
                description: "Updates user profile. Requires full name and valid email. Requires JWT authentication.",
                security: [
                {
                    bearerAuth: []
                }
                ],
                parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "User ID",
                    schema: { type: "string" }
                }
                ],
                requestBody: {
                required: true,
                content: {
                    "application/json": {
                    example: {
                        email: "updated@example.com",
                        fullName: "Updated Name",
                        phone: "9876543210",
                        address: "Updated Address"
                    }
                    }
                }
                },
                responses: {
                200: {
                    description: "User updated successfully",
                    content: {
                    "application/json": {
                        example: {
                        status: true,
                        message: "User updated successfully",
                        user: {
                            _id: "123456",
                            email: "updated@example.com",
                            fullName: "Updated Name",
                            phone: "9876543210",
                            address: "Updated Address",
                            "role": "admin",
                            "createdAt": "2025-07-01T00:00:00Z",
                            "updatedAt": "2025-07-01T00:00:00Z",
                            "__v":0
                        }
                        }
                    }
                    }
                },
                400: {
                    description: "Validation error"
                },
                404: {
                    description: "User not found"
                }
                }
            },
            delete: {
                tags: ["Users"],
                summary: "Delete user by ID",
                description: "Deletes a user from the database by their ID. Requires JWT authentication.",
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "User ID",
                        schema: { type: "string" }
                    }
                ],
            responses: {
                200: {
                    description: "User deleted successfully",
                    content: {
                    "application/json": {
                        example: {
                        status: true,
                        message: "User deleted successfully"
                        }
                    }
                    }
                },
                404: {
                    description: "User not found"
                }
            }
        },
        "/api/devices": {
            "get": {
                "tags": ["Devices"],
                "description": "Get all devices",
                "responses": {
                    "200": {
                        "description": "Successful retrieval of devices",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": { "$ref": "#/components/schemas/Device" }
                                },
                                "example": [
                                    {
                                        "_id": "deviceId123",
                                        "name": "Test Device",
                                        "powerRating": 1000,
                                        "userId": "userId123"
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": ["Devices"],
                "description": "Add a new device",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": { "$ref": "#/components/schemas/Device" },
                            "example": {
                                "name": "New Device",
                                "powerRating": 1500,
                                "userId": "userId123"
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Device created successfully",
                        "content": {
                            "application/json": {
                                "schema": { "$ref": "#/components/schemas/Device" },
                                "example": {
                                    "_id": "newDeviceId123",
                                    "name": "New Device",
                                    "powerRating": 1500,
                                    "userId": "userId123"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "content" : {
                            "application/json" : {
                                schema: { type: 'object', properties: { status: { type: 'boolean' }, message: { type: 'string' } } },
                                example: { status: false, message: 'Invalid device data' }
                            }
                        }
                    }
                }
            }
        },
    }
}
}