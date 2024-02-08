const User = require('./userModel');
const Profile = require('./profileModel');
const Drug = require('./drugModel');
const { Medication, MedicationIntake } = require('./medicationModel');
require('dotenv').config();

const models = {
    User: User,
    Profile: Profile,
    Drug: Drug,
    Medication: Medication,
    MedicationIntake: MedicationIntake
};

module.exports = models;