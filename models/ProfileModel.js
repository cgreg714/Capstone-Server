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
    profile_id: {
        type: mongoose.Types.ObjectId,
        ref: "profile"
    }
});

module.exports = mongoose.model('Profile', ProfileSchema)