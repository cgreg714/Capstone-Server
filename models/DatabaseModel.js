const mongoose = require('mongoose');
const { User } = require('../models/UserModel');
require('dotenv').config();

const db = mongoose.createConnection(process.env.MONGODB_URL);

const models = {
    User: db.model('User', User.schema, 'users'),
    // Profile: db.model('Profile', Profile.schema, 'profiles'),
    // Medication: db.model('Medication', Medication.schema, 'medications'),
};

module.exports = models;