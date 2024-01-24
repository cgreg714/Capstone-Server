const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/response');

// CREATE
exports.createProfile = async (req, res) => {
	try {
		const { firstName, lastName, email } = req.body;
		if (!firstName || !lastName || !email) throw new Error('Please input a first name, last name, and email.');

		const profileData = { ...req.body };
		const profile = await new models.Profile(profileData).save();

		profile ? success(res, profile) : incomplete(res, 'Profile creation failed');
	} catch (err) {
		error(res, err);
	}
};

// GET All Profiles
exports.getAllProfiles = async (req, res) => {
	try {
		const allProfiles = await models.Profile.find();

		allProfiles ? success(res, allProfiles) : incomplete(res, 'No profiles found');
	} catch (err) {
		error(res, err);
	}
};

// GET One Profile
exports.getProfile = async (req, res) => {
	try {
		const { id } = req.params;
		const getProfile = await models.Profile.findOne({ _id: id });

		if (!getProfile) throw new Error('Profile not found');

		getProfile ? success(res, getProfile) : incomplete(res, 'Profile not found');
	} catch (err) {
		error(res, err);
	}
};

// Patch Profile Information
exports.updateProfile = async (req, res) => {
	try {
		const task = await models.Profile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

		task ? success(res, task) : incomplete(res, 'Update failed');
	} catch (err) {
		error(res, err);
	}
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
	try {
		const user = await models.Profile.findById(req.params.id);
		if (!user) {
			return incomplete(res, 'Profile not found');
		}
		await user.deleteOne();
		success(res, { message: 'Profile deleted successfully' });
	} catch (err) {
		error(res, err);
	}
}