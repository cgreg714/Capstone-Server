const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/response');

// CREATE
exports.createProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, avatar } = req.body;
        const { userId } = req.params;
        if (!firstName || !lastName || !email) throw new Error('Please input a first name, last name, and email.');

        const profileData = { ...req.body, users: [userId] };
        const profile = await new models.Profile(profileData).save();

        const user = await models.User.findById(userId);
        if (!user) throw new Error('User not found');
        user.profiles.push(profile._id);
        await user.save();

        profile ? success(res, profile) : incomplete(res, 'Profile creation failed');
    } catch (err) {
        error(res, err);
    }
};

// GET All Profiles for a User
exports.getAllProfiles = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await models.User.findById(userId).populate('profiles');

		if (!user) throw new Error('User not found');

		user ? success(res, user.profiles) : incomplete(res, 'No profiles found');
	} catch (err) {
		error(res, err);
	}
};

// GET One Profile
exports.getProfile = async (req, res) => {
	try {
		const { profileId, userId } = req.params;
		const getProfile = await models.Profile.findOne({ _id: profileId, users: userId });

		if (!getProfile) throw new Error('Profile not found');

		getProfile ? success(res, getProfile) : incomplete(res, 'Profile not found');
	} catch (err) {
		error(res, err);
	}
};

// Patch Profile Information
exports.updateProfile = async (req, res) => {
	try {
		const { profileId, userId } = req.params;
		const updatedProfile = await models.Profile.findOneAndUpdate({ _id: profileId, users: userId }, req.body, { new: true, runValidators: true });

		updatedProfile ? success(res, updatedProfile) : incomplete(res, 'Update failed');
	} catch (err) {
		error(res, err);
	}
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
	try {
		const { profileId, userId } = req.params;
		const profile = await models.Profile.findOne({ _id: profileId, users: userId });
		if (!profile) {
			return incomplete(res, 'Profile not found');
		}
		await profile.deleteOne();
		success(res, { message: 'Profile deleted successfully' });
	} catch (err) {
		error(res, err);
	}
}

// GET All Notifications for a Profile
exports.getAllNotifications = async (req, res) => {
	try {
		const { profileId } = req.params;
		const profile = await models.Profile.findById(profileId).populate('notifications');

		if (!profile) throw new Error('Profile not found');

		profile ? success(res, profile.notifications) : incomplete(res, 'No notifications found');
	} catch (err) {
		error(res, err);
	}
};

// CREATE Notification
exports.createNotification = async (req, res) => {
	try {
		const { profileId } = req.params;
		const notificationData = { ...req.body, profile: profileId };
		const profile = await models.Profile.findById(profileId);
		if (!profile) throw new Error('Profile not found');
		profile.notifications.push(notificationData);
		await profile.save();
		const notification = profile.notifications[profile.notifications.length - 1];
		notification ? success(res, notification) : incomplete(res, 'Notification creation failed');
	} catch (err) {
		error(res, err);
	}
};

// GET One Notification
exports.getOneNotification = async (req, res) => {
	try {
		const { profileId, notificationId } = req.params;
		const profile = await models.Profile.findById(profileId);
		if (!profile) throw new Error('Profile not found');

		const notification = profile.notifications.id(notificationId);
		if (!notification) throw new Error('Notification not found');

		success(res, notification);
	} catch (err) {
		error(res, err);
	}
};

// Update Notification
exports.updateNotification = async (req, res) => {
	try {
		const { profileId, notificationId } = req.params;
		const profile = await models.Profile.findById(profileId);
		if (!profile) throw new Error('Profile not found');

		const notification = profile.notifications.id(notificationId);
		if (!notification) throw new Error('Notification not found');

		Object.assign(notification, req.body);
		await profile.save();

		success(res, notification);
	} catch (err) {
		error(res, err);
	}
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
	try {
		const { profileId, notificationId } = req.params;
		const profile = await models.Profile.findById(profileId);
		if (!profile) throw new Error('Profile not found');

		const notification = profile.notifications.id(notificationId);
		if (!notification) throw new Error('Notification not found');

		profile.notifications.pull(notificationId);
		await profile.save();

		success(res, { message: 'Notification deleted successfully' });
	} catch (err) {
		error(res, err);
	}
};

// Delete All Notifications
exports.deleteAllNotifications = async (req, res) => {
	try {
		const { profileId } = req.params;
		const profile = await models.Profile.findById(profileId);
		if (!profile) throw new Error('Profile not found');

		profile.notifications = [];
		await profile.save();

		success(res, { message: 'All notifications deleted successfully' });
	} catch (err) {
		error(res, err);
	}
};