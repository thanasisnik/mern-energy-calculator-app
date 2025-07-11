const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const authService = require('../services/auth.service');
const logger = require('../logger/logger')

exports.login = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    try {
        // Find user by email (only return password, fullName, and role)
        const result = await User.findOne ({email: email}, {password: 1, fullName: 1, role: 1});

        // Check if user exists
        if (!result) {
            return res.status(404).json({status: false, message: "Invalid email or password"});
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, result.password);

        if (!isPasswordValid) {
            logger.warn("Login: Invalid email or password.")
            return res.status(404).json({status: false, message: "Invalid email or password"});
        } else {
            // Generate JWT token
            const token = authService.generateToken(result);
            logger.info(`User ${email} logged in successfully.`)
            return res.status(200).json({status: true, message: "Login successful", data: token, User:{_id: result._id, fullName: result.fullName, email: result.email}});
        }
    } catch (err) {
        logger.error("Bad request")
        res.status(500).json({status: false, message: err.message});
    }

}