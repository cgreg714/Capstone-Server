const { Profile } = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/errorResponse');

// CREATE
exports.createProfile = async (req, res) => {
	try {
		const { firstName, lastName, email, pharmacy, doctor, timezone } = req.body;
		if (!firstName) throw new Error('Please input a first name.');

		const profile = await new Profile({
			firstName,
			lastName,
			email,
			pharmacy,
			doctor,
			timezone,
		}).save();

		profile ? success(res, profile) : incomplete(res);
	} catch (err) {
		error(res, err);
	}
};

// GET All Profiles
exports.getAllProfiles = async (req, res) => {
	try {
		const allProfiles = await Profile.find();

		allProfiles ? success(res, allProfiles) : incomplete(res);
	} catch (err) {
		error(res, err);
	}
};

// GET One Profile
exports.getProfile = async (req, res) => {
	try {
		const { id } = req.params;
		const getProfile = await Profile.findOne({ _id: id });

		if (!getProfile) throw new Error('Profile not found');

		getProfile ? success(res, getProfile) : incomplete(res);
	} catch (error) {
		error(res, err);
	}
};

// Patch Profile Information
exports.updateProfile = async (req, res) => {
	try {
		const task = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

		res.send(task);
	} catch (err) {
		incomplete(res, err);
	}
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
	try {
        const user = await Profile.findById(req.params.id);
        if (!user) {
            return next(new Error('Profile not found'));
        }
        await user.deleteOne();
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        error(res, err);
    }
}