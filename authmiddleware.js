const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT
const secretKey = 'your_secret_key';

// Middleware to authenticate users
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
}

// Middleware to check for admin role
function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).send('Access Denied');
    next();
}

module.exports = { authenticateToken, authorizeAdmin };