
const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({status: false, message: 'Access token is missing' });
    }

    const result = authService.verifyAccessToken(token);
    if (!result.verified) {
        return res.status(403).json({status: false, message: 'Invalid access token', error: result.data });
    }
    req.user = result.data; 
    next();
}