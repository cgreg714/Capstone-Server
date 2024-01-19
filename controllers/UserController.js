const { User } = require('../models/databaseModel');

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(new Error('User not found'));
        }

        if (req.userId !== user._id.toString()) {
            return next(new Error('Insufficient permissions'));
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        if (req.role === 'user') {
            return next(new Error('Insufficient permissions'));
        }

        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(new Error('User not found'));
        }

        if (req.role === 'user' && req.userId !== user._id.toString()) {
            return next(new Error('Insufficient permissions'));
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.changeUserRole = async (req, res, next) => {
    const { userId, newRole } = req.body;

    const validRoles = ['user', 'admin', 'root'];

    if (!validRoles.includes(newRole)) {
        return next(new Error('Invalid role'));
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return next(new Error('User not found'));
        }

        if (req.role === 'user' && req.userId !== user._id.toString()) {
            return next(new Error('Insufficient permissions'));
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully' });
    } catch (err) {
        next(err);
    }
};