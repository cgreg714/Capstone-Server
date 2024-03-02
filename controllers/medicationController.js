const models = require('../models/databaseModel');
const helpers = require('../helpers/response');

exports.createMedication = async (req, res) => {
    try {
        const { name, description, unitOfMeasurement, dose, quantity, drug, frequency, doctor, pharmacy } = req.body;

        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }

        const existingMedication = profile.medications.find(med => med.name === name);
        if (existingMedication) {
            return helpers.incomplete(res, 'A medication with the same name already exists in the profile');
        }

        // Fetch the associated drug from the database
        const associatedDrug = await models.Drug.findById(drug);
        if (!associatedDrug) {
            return helpers.incomplete(res, 'Associated drug not found');
        }

        // Extract the food interactions
        const foodInteractions = associatedDrug['food-interactions'].map(interaction => interaction['food-interaction']);

        const newMedication = { 
            name, 
            description, 
            unitOfMeasurement, 
            dose, 
            frequency, 
            quantity, 
            associatedDrug: drug,
            dateAdded: new Date(),
            doctor: { profile: profile._id, doctor },
            pharmacy: { profile: profile._id, pharmacy }
        };
        const medicationDoc = profile.medications.create(newMedication);
        profile.medications.push(medicationDoc);

        // Create a notification with the food interactions if there are any
        if (foodInteractions.length > 0) {
            const notificationData = {
                text: `The medication ${name} has been added. It has the following food interactions: ${foodInteractions.join(', ')}`,
                severity: 'high',
                type: 'warning'
            };
            profile.notifications.push(notificationData);
        }

        await profile.save();

        helpers.success(res, medicationDoc);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getAllMedications = async(req,res) => {
    try {
        const { profileId } = req.params;
        const profile = await models.Profile.findById(profileId).populate('medications.associatedDrug');
        
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
        helpers.success(res, { message: 'All meds cleared' });
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getMedicationById = async(req,res) => {
    try {
        const { profileId, medId } = req.params;
        const profile = await models.Profile.findById(profileId).populate('medications.associatedDrug');

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
        const profile = await models.Profile.findById(profileId).populate('medications.associatedDrug');

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

        helpers.success(res, { message: 'Medication Deleted' });
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

        helpers.success(res, medications);
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
        
        helpers.success(res, medications);
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
        
        helpers.success(res, medications);
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.toggleField = async (req, res) => {
    try {
        const { profileId, medId, field } = req.params;

        const fieldParts = field.split('.');
        const mainField = fieldParts[0];
        const subField = fieldParts[1];

        const profile = await models.Profile.findById(profileId);

        // Find the correct medication
        const medication = profile.medications.find(med => med._id.toString() === medId);

        if (!medication) {
            throw new Error(`Medication with id ${medId} does not exist`);
        }

        // Check if the field exists before toggling
        if (subField) {
            if (medication.frequency[mainField] && medication.frequency[mainField][subField] !== undefined) {
                medication.frequency[mainField][subField] = !medication.frequency[mainField][subField];
                console.log(`Toggled ${mainField}.${subField} to ${medication.frequency[mainField][subField]}`);
            } else {
                throw new Error(`Field ${mainField}.${subField} does not exist`);
            }
        } else {
            if (medication.frequency[mainField] !== undefined) {
                medication.frequency[mainField] = !medication.frequency[mainField];
                console.log(`Toggled ${mainField} to ${medication.frequency[mainField]}`);
            } else {
                throw new Error(`Field ${mainField} does not exist`);
            }
        }

        profile.markModified('medications');

        await profile.save();
        console.log('Saved profile');

        helpers.success(res, medication);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.addQuantity = async (req, res) => {
    try {
        const { profileId, medId } = req.params;
        const { quantity } = req.body;
        const profile = await models.Profile.findById(profileId);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const medication = profile.medications.id(medId);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        medication.quantity = Number(medication.quantity) + Number(quantity);

        profile.markModified('medications');
        await profile.save();

        // Populate the associatedDrug field
        const updatedProfile = await models.Profile.findById(profileId).populate('medications.associatedDrug');

        // Fetch the updated medication object including all fields
        const updatedMedication = updatedProfile.medications.id(medId);

        helpers.success(res, updatedMedication);
    } catch (err) {
        helpers.error(res, err);
    }
};