const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/response');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await models.User.find().populate('profiles');
        success(res, users);
    } catch (err) {
        error(res, err);
    }
};

exports.getOneUser = async (req, res, next) => {
    console.log("🚀 ~ file: userController.js:14 ~ exports.getOneUser= ~ req.params:", req.params)
    try {
        const user = await models.User.findById(req.params.userId)
        if (!user) {
            return incomplete(res, 'User not found');
        }

        success(res, user);
    } catch (err) {
        error(res, err);
    }
};

exports.updateUser = async (req, res, next) => {
    const { username, email } = req.body;
    const { userId } = req.params;

    try {
        const user = await models.User.findById(userId);
        if (!user) {
            return incomplete(res, 'User not found');
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        success(res, { message: 'User updated successfully' });
    } catch (err) {
        error(res, err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await models.User.findById(req.params.userId);
        if (!user) {
            return incomplete(res, 'User not found');
        }

        await user.deleteOne();
        success(res, { message: 'User deleted successfully' });
    } catch (err) {
        error(res, err);
    }
};

exports.changeUserRole = async (req, res, next) => {
    const { userId, newRole } = req.body;

    const validRoles = ['user', 'admin', 'root'];

    if (!validRoles.includes(newRole)) {
        return incomplete(res, 'Invalid role');
    }

    try {
        const user = await models.User.findById(userId);
        if (!user) {
            return incomplete(res, 'User not found');
        }

        user.role = newRole;
        await user.save();

        success(res, { message: 'User role updated successfully' });
    } catch (err) {
        error(res, err);
    }
};

exports.addProfileToUser = async (req, res, next) => {
    const { userId, profileId } = req.params;

    try {
        const user = await models.User.findById(userId);
        if (!user) {
            return incomplete(res, 'User not found');
        }

        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return incomplete(res, 'Profile not found');
        }

        user.profiles.push(profileId);
        profile.users.push(userId);
        await user.save();
        await profile.save();

        success(res, { message: 'Profile added to user successfully' });
    } catch (err) {
        error(res, err);
    }
};

exports.removeProfileFromUser = async (req, res, next) => {
    const { userId, profileId } = req.params;

    try {
        const user = await models.User.findById(userId);
        if (!user) {
            return incomplete(res, 'User not found');
        }

        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return incomplete(res, 'Profile not found');
        }

        user.profiles = user.profiles.filter(id => id.toString() !== profileId);
        profile.users = profile.users.filter(id => id.toString() !== userId);
        await user.save();
        await profile.save();

        success(res, { message: 'Profile removed from user successfully' });
    } catch (err) {
        error(res, err);
    }
};