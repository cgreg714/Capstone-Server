const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/response');

// CREATE
exports.createProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, avatar } = req.body;
        console.log("🚀 ~ file: profileController.js:8 ~ exports.createProfile= ~ avatar:", avatar)
        const { userId } = req.params;
        if (!firstName || !lastName || !email) throw new Error('Please input a first name, last name, and email.');

        const profileData = { ...req.body, users: [userId] };
        const profile = await new models.Profile(profileData).save();

        // Find the user and add the profile to the user's profiles
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
		const task = await models.Profile.findOneAndUpdate({ _id: profileId, users: userId }, req.body, { new: true, runValidators: true });

		task ? success(res, task) : incomplete(res, 'Update failed');
	} catch (err) {
		error(res, err);
	}
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
	try {
		const { profileId, userId } = req.params;
		const user = await models.Profile.findOne({ _id: profileId, users: userId });
		if (!user) {
			return incomplete(res, 'Profile not found');
		}
		await user.deleteOne();
		success(res, { message: 'Profile deleted successfully' });
	} catch (err) {
		error(res, err);
	}
}