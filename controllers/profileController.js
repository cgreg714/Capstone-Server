const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/errorResponse');

// CREATE
exports.createProfile = async (req, res) => {
	try {
		const { firstName, lastName, email, pharmacy, doctor, timezone } = req.body;
		if (!firstName) throw new Error('Please input a first name.');

		const profile = await new models.Profile({
			firstName,
			lastName,
			email,
			pharmacy,
		}).save();

		profile ? success(res, profile) : incomplete(res);
	} catch (err) {
		error(res, err);
	}
};

// GET All Profiles
exports.getAllProfiles = async (req, res) => {
	try {
		const allProfiles = await models.Profile.find();

		allProfiles ? success(res, allProfiles) : incomplete(res);
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

		getProfile ? success(res, getProfile) : incomplete(res);
	} catch (err) {
		error(res, err);
	}
};

// Patch Profile Information
exports.updateProfile = async (req, res) => {
	try {
		const task = await models.Profile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

		res.send(task);
	} catch (err) {
		incomplete(res, err);
	}
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
	try {
        const user = await models.Profile.findById(req.params.id);
        if (!user) {
            return next(new Error('Profile not found'));
        }
        await user.deleteOne();
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        error(res, err);
    }
}

// Add Doctor to Profile
exports.addDoctorToProfile = async (req, res) => {
    try {
        const doctor = new models.Doctor({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        const savedDoctor = await doctor.save();

        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        profile.doctors.push(savedDoctor._id);
        await profile.save();

        res.status(200).json(savedDoctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Doctor in Profile
exports.updateDoctorInProfile = async (req, res) => {
	try {
		const profile = await models.Profile.findById(req.params.profileId);
		if (!profile) throw new Error('Profile not found');

		const doctorIndex = profile.doctors.indexOf(req.params.doctorId);
		if (doctorIndex === -1) throw new Error('Doctor not found in profile');

		// Update the doctor
		const updatedDoctor = await models.Doctor.findByIdAndUpdate(req.params.doctorId, req.body, { new: true, runValidators: true });
		if (!updatedDoctor) throw new Error('Error updating doctor');

		success(res, updatedDoctor);
	} catch (err) {
		error(res, err);
	}
};

// Remove Doctor from Profile
exports.removeDoctorFromProfile = async (req, res) => {
	try {
		const profile = await models.Profile.findById(req.params.profileId);
		if (!profile) throw new Error('Profile not found');

		const doctorIndex = profile.doctors.indexOf(req.params.doctorId);
		if (doctorIndex === -1) throw new Error('Doctor not found in profile');

		profile.doctors.splice(doctorIndex, 1);
		await profile.save();

		success(res, profile);
	} catch (err) {
		error(res, err);
	}
};

// Add Medication to Profile
exports.addMedsToProfile = async (req, res) => {
	try {
		const profile = await models.Profile.findById(req.params.profileId);
		if (!profile) throw new Error('Profile not found');

		const medication = await models.Medication.findById(req.body.medId);
		if (!medication) throw new Error('Medication not found');

		profile.medications.push(medication._id);
		await profile.save();

		success(res, profile);
	} catch (err) {
		error(res, err);
	}
};

// Update Medication in Profile
exports.updateMedsInProfile = async (req, res) => {
	try {
		const profile = await models.Profile.findById(req.params.profileId);
		if (!profile) throw new Error('Profile not found');

		const medIndex = profile.medications.indexOf(req.params.medId);
		if (medIndex === -1) throw new Error('Medication not found in profile');

		// Update the medication
		const updatedMedication = await models.Medication.findByIdAndUpdate(req.params.medId, req.body, { new: true, runValidators: true });
		if (!updatedMedication) throw new Error('Error updating medication');

		success(res, updatedMedication);
	} catch (err) {
		error(res, err);
	}
};

// Remove Medication from Profile
exports.removeMedsFromProfile = async (req, res) => {
	try {
		const profile = await models.Profile.findById(req.params.profileId);
		if (!profile) throw new Error('Profile not found');

		const medIndex = profile.medications.indexOf(req.params.medId);
		if (medIndex === -1) throw new Error('Medication not found in profile');

		profile.medications.splice(medIndex, 1);
		await profile.save();

		success(res, profile);
	} catch (err) {
		error(res, err);
	}
};