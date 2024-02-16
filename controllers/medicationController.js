const models = require('../models/databaseModel');
const helpers = require('../helpers/response');

exports.createMedication = async (req, res) => {
    try {
        const { name, description, unitOfMeasurement, dose, quantity, prescriber, drug, frequency } = req.body;

        const profile = await models.Profile.findById(req.params.profileId);
        if (!profile) {
            return helpers.incomplete(res, 'Profile not found');
        }

        const existingMedication = profile.medications.find(med => med.name === name);
        if (existingMedication) {
            return helpers.incomplete(res, 'A medication with the same name already exists in the profile');
        }

        const newMedication = { 
            name, 
            description, 
            unitOfMeasurement, 
            dose, 
            frequency, 
            quantity, 
            prescriber, 
            associatedDrug: drug,
            dateAdded: new Date() 
        };
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
        helpers.success(res, { message: 'All meds cleared' });
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
        } else if (medication.associatedDrug) {
            return res.status(400).json({ message: 'Medication already has an associated drug' });
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

// Medication intake
exports.createIntake = async (req, res) => {
    try {
        const { takenAt } = req.body;
        const profile = await models.Profile.findById(req.params.profileId);
        const medId = req.params.medId;
        const medication = profile.medications.id(medId);

        if (!medication) {
            return helpers.error(res, { message: 'Medication not found' });
        }

        const newMedicationIntake = new models.MedicationIntake({ takenAt, medication: medication._id, profile: profile._id });
        await newMedicationIntake.save();

        medication.medicationIntakes.push(newMedicationIntake._id);
        await profile.save();

        helpers.success(res, newMedicationIntake);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getAllIntakes = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId).populate('medications.medicationIntakes');
        const medication = profile.medications.id(req.params.medId);

        if (!medication) {
            return helpers.error(res, { message: 'Medication not found' });
        }

        helpers.success(res, medication.medicationIntakes);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.deleteAllIntakes = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        const medication = profile.medications.id(req.params.medId);

        medication.medicationIntakes = [];
        await profile.save();
        helpers.success(res, { message: 'All medication intakes cleared' });
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getIntake = async (req, res) => {
    try {
        const medId = req.params.medId;
        const medicationIntake = await models.MedicationIntake.findOne({ _id: req.params.intakeId, medication: medId });
        if (!medicationIntake) {
            return helpers.error(res, { message: 'Medication intake not found' });
        }

        helpers.success(res, medicationIntake);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.updateIntake = async (req, res) => {
    try {
        const updates = req.body;
        const medicationIntake = await models.MedicationIntake.findById(req.params.intakeId);
        if (!medicationIntake) {
            return helpers.error(res, { message: 'Medication intake not found' });
        }

        for (let key in updates) {
            medicationIntake[key] = updates[key];
        }

        await medicationIntake.save();
        helpers.success(res, medicationIntake);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.deleteIntake = async (req, res) => {
    try {
        await models.MedicationIntake.findByIdAndDelete(req.params.intakeId);

        await models.Profile.updateOne(
            { _id: req.params.profileId, "medications._id": req.params.medId },
            { $pull: { "medications.$.medicationIntakes": req.params.intakeId } }
        );

        helpers.success(res, { message: 'Medication intake deleted' });
    } catch (err) {
        helpers.error(res, err);
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
            // The field is a subfield of timeOfDay or dayOfTheWeek
            if (medication.frequency[mainField] && medication.frequency[mainField][subField] !== undefined) {
                medication.frequency[mainField][subField] = !medication.frequency[mainField][subField];
                console.log(`Toggled ${mainField}.${subField} to ${medication.frequency[mainField][subField]}`);
            } else {
                throw new Error(`Field ${mainField}.${subField} does not exist`);
            }
        } else {
            // The field is daily, weekly, biWeekly, or monthly
            if (medication.frequency[mainField] !== undefined) {
                medication.frequency[mainField] = !medication.frequency[mainField];
                console.log(`Toggled ${mainField} to ${medication.frequency[mainField]}`);
            } else {
                throw new Error(`Field ${mainField} does not exist`);
            }
        }

        // Mark the medications array as modified
        profile.markModified('medications');

        await profile.save();
        console.log('Saved profile');

        helpers.success(res, medication);
    } catch (err) {
        helpers.error(res, err);
    }
};