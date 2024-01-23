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

DoctorSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

const ProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String
    },
    pharmacy: {
        type: String
    },
    timezone: {
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],
    medications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication'
    }],
    abuddies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ABuddy'
    }]
});

ProfileSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

const Profile = mongoose.model('Profile', ProfileSchema, 'profiles');
const Doctor = mongoose.model('Doctor', DoctorSchema, 'doctors');

module.exports = { Profile, Doctor };