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
    doctor: [DoctorSchema],
    timezone: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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

module.exports = Profile;