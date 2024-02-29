const models = require('../models/databaseModel');
const helpers = require('../helpers/response');
const {createNotification} = require('./profileController');

function createMedicationNotification(medication, quantity) {
    let notificationText;
    let notificationSeverity;
    let notificationType;

    if (quantity === 0) {
        notificationText = `You are out of ${medication.name}. Please refill your prescription immediately.`;
        notificationSeverity = 'error';
        notificationType = 'empty_medication';
    } else if (quantity < 5) {
        notificationText = `You are critically low on ${medication.name}. Only ${quantity} remaining. Please refill your prescription.`;
        notificationSeverity = 'high';
        notificationType = 'low_medication';
    } else if (quantity < 10) {
        notificationText = `You are low on ${medication.name}. Only ${quantity} remaining. Please refill your prescription soon.`;
        notificationSeverity = 'medium';
        notificationType = 'low_medication';
    } else if (quantity < 15) {
        notificationText = `You have ${quantity} of ${medication.name} remaining. Consider refilling your prescription.`;
        notificationSeverity = 'low';
        notificationType = 'low_medication';
    }

    return notificationText ? { text: notificationText, severity: notificationSeverity, type: notificationType } : null;
}

// Medication intake

exports.createIntake = async (req, res) => {
    try {
        const { takenAt, quantity } = req.body;
        const profile = await models.Profile.findById(req.params.profileId);
        const medId = req.params.medId;
        const medication = profile.medications.id(medId);

        if (!medication) {
            return helpers.error(res, { message: 'Medication not found' });
        }

        medication.quantity -= quantity;
        if (medication.quantity < 0) {
            return helpers.error(res, { message: 'Insufficient medication quantity' });
        }

        const newMedicationIntake = { 
            takenAt, 
            quantity, 
            medication: medication._id, 
            profile: profile._id 
        };
        medication.medicationIntakes.push(newMedicationIntake);

        const notification = createMedicationNotification(medication, medication.quantity);
        if (notification) {
            const existingNotification = profile.notifications.find(n =>
                n.text.includes(medication.name) && n.text.includes(notification.type)
            );
            if (existingNotification) {
                existingNotification.text = notification.text;
            } else {
                profile.notifications.push({
                    text: notification.text,
                    severity: notification.severity,
                    type: notification.type,
                    read: false,
                });
            }
            await profile.save();
        }

        helpers.success(res, newMedicationIntake);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getAllIntakes = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
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
        const profile = await models.Profile.findById(req.params.profileId);
        const medication = profile.medications.id(req.params.medId);
        const medicationIntake = medication.medicationIntakes.id(req.params.intakeId);

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
        const profile = await models.Profile.findById(req.params.profileId);
        const medication = profile.medications.id(req.params.medId);
        const medicationIntake = medication.medicationIntakes.id(req.params.intakeId);

        if (!medicationIntake) {
            return helpers.error(res, { message: 'Medication intake not found' });
        }

        for (let key in updates) {
            medicationIntake[key] = updates[key];
        }

        await profile.save();
        helpers.success(res, medicationIntake);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.deleteIntake = async (req, res) => {
    try {
        const profile = await models.Profile.findById(req.params.profileId);
        const medication = profile.medications.id(req.params.medId);
        const intakeId = req.params.intakeId;

        if (!medication) {
            return helpers.error(res, { message: 'Medication not found' });
        }

        const intake = medication.medicationIntakes.id(intakeId);
        if (!intake) {
            return helpers.error(res, { message: 'Intake not found' });
        }

        medication.quantity += intake.quantity;

        medication.medicationIntakes.pull(intakeId);
        await profile.save();

        helpers.success(res, { message: 'Medication intake deleted' });
    } catch (err) {
        helpers.error(res, err);
    }
};