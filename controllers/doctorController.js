const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/response');

// Add Doctor to Profile
exports.createDoctor = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;

        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const existingDoctor = profile.doctors.find(doc => doc.firstName === firstName && doc.lastName === lastName);
        if (existingDoctor) {
            return res.status(400).json({ message: 'A doctor with the same first and last name already exists in the profile' });
        }

        const newDoctor = { ...req.body };
        const doctorDoc = profile.doctors.create(newDoctor);
        profile.doctors.push(doctorDoc);
        await profile.save();

        success(res, doctorDoc);
    } catch (err) {
        error(res, err);
    }
};

// Get All Doctors for a Profile
exports.getAllDoctors = async (req, res) => {
    try {
        const { profileId } = req.params;
        const profile = await models.Profile.findById(profileId);

        if (!profile) throw new Error('Profile not found');

        success(res, profile.doctors);
    } catch (err) {
        error(res, err);
    }
};

// Get One Doctor from a Profile
exports.getOneDoctor = async (req, res) => {
    try {
        const { profileId, doctorId } = req.params;
        const profile = await models.Profile.findById(profileId);

        if (!profile) throw new Error('Profile not found');

        const doctor = profile.doctors.id(doctorId);
        if (!doctor) throw new Error('Doctor not found');

        success(res, doctor);
    } catch (err) {
        error(res, err);
    }
};

// Update Doctor in Profile
exports.updateDoctor = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');

        const doctor = profile.doctors.id(req.params.doctorId);
        if (!doctor) throw new Error('Doctor not found in profile');

        // Update the doctor
        doctor.set(req.body);
        await profile.save();

        success(res, doctor);
    } catch (err) {
        error(res, err);
    }
};

// Remove Doctor from Profile
exports.deleteDoctor = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) throw new Error('Profile not found');

        const doctor = profile.doctors.id(req.params.doctorId);
        if (!doctor) throw new Error('Doctor not found in profile');

        profile.doctors.pull(doctor);
        await profile.save();

        success(res, doctor);
    } catch (err) {
        error(res, err);
    }
};