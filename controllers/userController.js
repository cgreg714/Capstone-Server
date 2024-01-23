const models = require('../models/databaseModel');

exports.getUser = async (req, res, next) => {
    try {
        const user = await models.User.findById(req.params.userId)
        if (!user) {
            return next(new Error('User not found'));
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        // if (req.role === 'user') {
        //     return next(new Error('Insufficient permissions'));
        // }

        const users = await models.User.find().populate('profiles');
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    const { username, email } = req.body;
    const { userId } = req.params;

    try {
        const user = await models.User.findById(userId);
        if (!user) {
            return next(new Error('User not found'));
        }

        // if (req.role === 'user' && req.userId !== user._id.toString()) {
        //     return next(new Error('Insufficient permissions'));
        // }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await models.User.findById(req.params.userId);
        if (!user) {
            return next(new Error('User not found'));
        }

        // if (req.role === 'user' && req.userId !== user._id.toString()) {
        //     return next(new Error('Insufficient permissions'));
        // }

        await user.deleteOne();
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
        const user = await models.User.findById(userId);
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

exports.addProfileToUser = async (req, res, next) => {
    const { userId, profileId } = req.params;

    try {
        const user = await models.User.findById(userId);
        if (!user) {
            return next(new Error('User not found'));
        }

        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return next(new Error('Profile not found'));
        }

        // Add the profile to the user and the user to the profile
        user.profiles.push(profileId);
        profile.users.push(userId);
        await user.save();
        await profile.save();

        res.status(200).json({ message: 'Profile added to user successfully' });
    } catch (err) {
        next(err);
    }
};

exports.removeProfileFromUser = async (req, res, next) => {
    const { userId, profileId } = req.params;

    try {
        const user = await models.User.findById(userId);
        if (!user) {
            return next(new Error('User not found'));
        }

        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return next(new Error('Profile not found'));
        }

        // Remove the profile from the user and the user from the profile
        user.profiles = user.profiles.filter(id => id.toString() !== profileId);
        profile.users = profile.users.filter(id => id.toString() !== userId);
        await user.save();
        await profile.save();

        res.status(200).json({ message: 'Profile removed from user successfully' });
    } catch (err) {
        next(err);
    }
};