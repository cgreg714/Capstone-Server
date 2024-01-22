const mongoose = require('mongoose');
const User = require('./userModel');
const Profile = require('./profileModel');
const ABuddy = require('./abuddyModel');
const Drug = require('./drugModel');
const Medication = require('./medicationModel');
require('dotenv').config();

const db = mongoose.createConnection(process.env.MONGODB + '/' + process.env.DB_NAME);

const models = {
    User: User,
    Profile: Profile,
    ABuddy: ABuddy,
    Drug: Drug,
    Medication: Medication,
};

module.exports = models;