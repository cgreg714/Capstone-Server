const mongoose = require('mongoose');
const { MedicationSchema } = require('./medicationModel');

const AddressSchema = new mongoose.Schema({
	street: String,
	city: String,
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
		sparse: true
	},
	phoneNumber: {
		type: String,
		required: true,
	},
});

const DoctorSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	address: AddressSchema,
	phoneNumber: String,
});

const PharmacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: AddressSchema,
    phoneNumber: String,
});

const NotificationSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	timeDismissed: {
		type: Date,
	},
	severity: {
		type: String,
		enum: ['low', 'medium', 'high'],
		default: 'low',
	},
	type: { type: String, enum: ['error', 'warning', 'info', 'next_intake', 'low_medication', 'missed_medication', 'empty_medication'] },

	read: {
		type: Boolean,
		default: false,
	},
});

const ProfileSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: false,
	},
	lastName: {
		type: String,
		required: false,
	},
	email: {
		type: String,
	},
	pharmacy: [PharmacySchema],
	timezone: {
		type: String,
	},
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	avatar: {
		type: String,
	},
	doctors: [DoctorSchema],
	medications: [MedicationSchema],
	abuddies: [aBuddySchema],
	notifications: [NotificationSchema],
});

ProfileSchema.index({ firstName: 1, lastName: 1, email: 1 }, { unique: true });

const Profile = mongoose.model('Profile', ProfileSchema, 'profiles');

module.exports = Profile;