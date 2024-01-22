const mongoose = require('mongoose');
const User = require('./userModel');
const Profile = require('./profileModel');
const ABuddy = require('./abuddyModel');
const Drug = require('./drugModel');
const Medication = require('./medicationModel');
require('dotenv').config();

const db = mongoose.createConnection(process.env.MONGODB_URL);

const models = {
    User: User,
    Profile: Profile,
    ABuddy: ABuddy,
    Drug: Drug,
    Medication: Medication,
};

module.exports = models;