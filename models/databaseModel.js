const User = require('./userModel');
const { Profile, Doctor } = require('./profileModel');
const ABuddy = require('./abuddyModel');
const Drug = require('./drugModel');
const Medication = require('./medicationModel');
require('dotenv').config();

const models = {
    User: User,
    Profile: Profile,
    Doctor: Doctor,
    ABuddy: ABuddy,
    Drug: Drug,
    Medication: Medication,
};

module.exports = models;