const jwt = require('jsonwebtoken');
const { User } = require('../models/DatabaseModel');

const authenticate = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return next(new Error('Access Denied'));

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified._id;
        req.role = verified.role;
        next();
    } catch (err) {
        next(new Error('Invalid Token'));
    }
};

const requireRole = role => {
    return (req, res, next) => {
        if (req.role && req.role === role) {
            next();
        } else {
            next(new Error('Forbidden'));
        }
    };
};

module.exports = { authenticate, requireRole };