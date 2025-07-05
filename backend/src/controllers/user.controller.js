const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const logger = require('../logger/logger');

// Create a new user
exports.createUser = async (req, res) => {

    let data = req.body;

    const salt = 10;
    const hashedPassword = await bcrypt.hash(data.password, salt);

    //Check if user exist or create New user instance
    const existingUser = await User.findOne({ email: data.email });
    // If user already exists, return error
    if (existingUser) {
        return res.status(400).json({status: false, message: "User already exists"});
    }  
    // Validate required fields
    if (!data.email || !data.password) {
        return res.status(400).json({status: false, message: "Email and password are required"});
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return res.status(400).json({status: false, message: "Invalid email format"});
    }
    // Validate password length 
    if (data.password.length < 6) {
        return res.status(400).json({status: false, message: "Password must be at least 6 characters long"});
    } 
    // Create a new user instance
    const user = new User({
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        })

    try {
        const result = await user.save();
        logger.info(`User ${user.fullName} succesfully register.`)
        res.status(201).json({status: true, message: " User created successfully"});
    } catch (err) {
        logger.error(`Error at register: ${err.message}`)
        res.status(400).json({status: false, message: err.message});
    }
}

// Show user profile
exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId, { password: 0 }); // Exclude password from response
        if (!user) {
            return res.status(404).json({status: false, message: "User not found"});
        }
        res.status(200).json({status: true, user: user});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
}


// Update user profile
exports.updateUserById = async (req, res) => {
    const userId = req.params.id;
    const data = req.body;

    // Validate required fields
    if (!data.email || !data.fullName) {
        return res.status(400).json({status: false, message: "Email and full name are required"});
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return res.status(400).json({status: false, message: "Invalid email format"});
    }

    try {
        const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({status: false, message: "User not found"});
        }
        res.status(200).json({status: true, message: "User updated successfully", user: user});
    } catch (err) {
        // console.error("UPDATE ERROR:", err);
        res.status(500).json({status: false, message: err.message});
    }
}

// Delete user profile
exports.deleteUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({status: false, message: "User not found"});
        }
        res.status(200).json({status: true, message: "User deleted successfully"});
    } catch (err) {
        res.status(500).json({status: false, message: err.message});
    }
}