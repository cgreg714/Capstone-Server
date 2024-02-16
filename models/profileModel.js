const mongoose = require('mongoose');
const { MedicationSchema } = require('./medicationModel');

const AddressSchema = new mongoose.Schema({
    street: String,
    cityOrTown: String,
    state: String,
    zip: String,
});

const aBuddySchema = new mongoose.Schema({
    
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    relation: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
});

const DoctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: AddressSchema,
    phoneNumber: String,
});

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
    doctors: [DoctorSchema],
    medications: [MedicationSchema],
    abuddies: [aBuddySchema]
});

ProfileSchema.index({ firstName: 1, lastName: 1, email: 1 }, { unique: true });

const Profile = mongoose.model('Profile', ProfileSchema, 'profiles');

module.exports = Profile ;