const mongoose = require('mongoose');
const { User } = require('./userModel');
const { Profile } = require('./profileModel');
const { Drug } = require('./drugModel');
// const { Medication } = require('../models/MedicationModel');
require('dotenv').config();

const db = mongoose.createConnection(process.env.MONGODB_URL);

const models = {
    User: db.model('User', User.schema, 'users'),
    Drug: db.model('Drug', Drug.schema, 'drugs'),
    Profile: db.model('Profile', Profile.schema, 'profiles'),
    // Medication: db.model('Medication', Medication.schema, 'medications'),
};

module.exports = models;