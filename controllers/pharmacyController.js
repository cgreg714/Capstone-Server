const models = require('../models/databaseModel');
const helpers = require('../helpers/response');

exports.createPharmacy = async (req, res) => {
    try {
        const { profileId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }

        const pharmacyData = req.body;
        profile.pharmacy.push(pharmacyData);
        await profile.save();

        helpers.success(res, pharmacyData);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getAllPharmacies = async (req, res) => {
    try {
        const { profileId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }

        helpers.success(res, profile.pharmacy);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getOnePharmacy = async (req, res) => {
    try {
        const { profileId, pharmacyId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }

        const pharmacy = profile.pharmacy.id(pharmacyId);
        if (!pharmacy) {
            return helpers.incomplete(res, 'Pharmacy not found');
        }

        helpers.success(res, pharmacy);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.updatePharmacy = async (req, res) => {
    try {
        const { profileId, pharmacyId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }

        const pharmacy = profile.pharmacy.id(pharmacyId);
        if (!pharmacy) {
            return helpers.incomplete(res, 'Pharmacy not found');
        }

        Object.assign(pharmacy, req.body);
        await profile.save();

        helpers.success(res, pharmacy);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.deletePharmacy = async (req, res) => {
    try {
        const { profileId, pharmacyId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }

        profile.pharmacy.pull(pharmacyId);
        await profile.save();

        helpers.success(res, { message: 'Pharmacy deleted successfully' });
    } catch (err) {
        helpers.error(res, err);
    }
};