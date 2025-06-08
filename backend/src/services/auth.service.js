const jwt = require('jsonwebtoken');

function generateToken(user) {


    const payload = {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
    }

    const secret = process.env.JWT_SECRET;
    const options = {expiresIn: '1h'};

    return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {

    const secret = process.env.JWT_SECRET;
     try {
        const payload = jwt.verify(token, secret);
        return {verified: true, data: payload};
    } catch (err) {
        return {verified: false, data: err.message}
    }
    
}

module.exports = {
    generateToken,
    verifyAccessToken,
};