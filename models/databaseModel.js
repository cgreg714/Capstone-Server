const User = require('./userModel');
const Profile = require('./profileModel');
const Drug = require('./drugModel');
require('dotenv').config();

const models = {
    User: User,
    Profile: Profile,
    Drug: Drug,
};

module.exports = models;