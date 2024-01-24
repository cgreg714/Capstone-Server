const models = require('../models/databaseModel');
const helpers = require('../helpers/response');

exports.createMedication = async (req, res) => {
    try {
        const { name, description, dosages, dose, frequency, quantity, dateAdded, prescriber, timeOfDay } = req.body;

        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }

        const existingMedication = profile.medications.find(med => med.name === name);
        if (existingMedication) {
            return helpers.incomplete(res, 'A medication with the same name already exists in the profile');
        }

        const newMedication = { name, description, dosages, dose, frequency, quantity, dateAdded: new Date(), prescriber, timeOfDay };
        const medicationDoc = profile.medications.create(newMedication);
        profile.medications.push(medicationDoc);
        await profile.save();

        helpers.success(res, medicationDoc);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getAllMedications = async(req,res) => {
    try {
        const { profileId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }
        helpers.success(res, profile.medications);
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.deleteAllMedications = async(req,res) => {
    try {
        const { profileId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        profile.medications = [];
        await profile.save();
        success(res, { message: 'All meds cleared' });
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getMedicationById = async(req,res) => {
    try {
        const { profileId, medId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const medication = profile.medications.id(medId);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        helpers.success(res, medication);
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.updateMedication = async(req,res) => {
    try {
        const { profileId, medId } = req.params;
        const updates = req.body;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const medication = profile.medications.id(medId);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        for (let key in updates) {
            medication[key] = updates[key];
        }
        await profile.save();
        helpers.success(res, medication);
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.deleteByID = async(req,res) => {
    try {
        const { profileId, medId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const medication = profile.medications.id(medId);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        profile.medications.pull(medId);
        await profile.save();
        success(res, { message: 'Medication Deleted' });
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByPrescriber = async(req,res) => {
    try {
        const { profileId, prescriber } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const medications = profile.medications.filter(med => med.prescriber === prescriber);

        res.status(200).json(medications.length > 0 ? medications : "No prescriber found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByName = async(req,res) => {
    try {
        const { profileId, name } =req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const medications = profile.medications.filter(med => med.name === name);
        
        res.status(200).json(medications.length > 0 ? medications : "No medication found by that name");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByDate = async(req,res) => {
    try {
        const { profileId, dateAdded } =req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const medications = profile.medications.filter(med => med.dateAdded === dateAdded);
        
        res.status(200).json(medications.length > 0 ? medications : "No medication found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.addDrugToMedication = async (req, res) => {
    try {
        const { profileId, medId, drugId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const medication = profile.medications.id(medId);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        const drug = await models.Drug.findById(drugId);
        if (!drug) {
            return res.status(404).json({ message: 'Drug not found' });
        }
        medication.associatedDrug = drugId;
        medication.description = drug.description;
        await profile.save();
        helpers.success(res, medication);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.removeDrugFromMedication = async (req, res) => {
    try {
        const { profileId, medId, drugId } = req.params;
        const profile = await models.Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const medication = profile.medications.id(medId);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        if (medication.associatedDrug.toString() !== drugId) {
            return res.status(400).json({ message: 'Drug not associated with this medication' });
        }
        medication.associatedDrug = undefined;
        medication.description = undefined;
        await profile.save();
        helpers.success(res, medication);
    } catch (err) {
        helpers.error(res, err);
    }
};