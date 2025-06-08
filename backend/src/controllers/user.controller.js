const User = require('../models/user.model');
const bcrypt = require('bcrypt');

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

    const user = new User({
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        })

    try {
        const result = await user.save();
        res.status(201).json({status: true, message: " User created successfully"});
    } catch (err) {
        res.status(400).json({status: false, message: err.message});
    }

}