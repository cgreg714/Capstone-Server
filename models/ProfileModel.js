const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
})

const ProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    pharmacy: {
        type: String
    },
    doctor: [DoctorSchema],
    timezone: {
        type: String
    }
});

module.exports = mongoose.model('Profile', ProfileSchema)