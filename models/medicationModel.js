const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicationIntakeSchema = new Schema({
	medication: { type: Schema.Types.ObjectId, ref: 'Medication', required: true },
	profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
	takenAt: { type: Date, default: Date.now }
});

const MedicationSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: String,
	unitOfMeasurement: String,
	dose: {
		type: Number,
		required: true,
	},
	frequency: {
		time: {
			type: String,
		},
		timeOfDay: {
			'morning':Boolean,
			'noon':Boolean,
			'evening':Boolean,
			'bedtime':Boolean
		},
		dayOfTheWeek: {
			'sunday': Boolean,
			'monday': Boolean,
			'tuesday': Boolean,
			'wednesday': Boolean,
			'thursday': Boolean,
			'friday': Boolean,
			'saturday': Boolean
		},
		day: {
			type: Number,
			min: 1,
			max: 31,
		},
		daily: {
			type: Boolean,
			default: false,
		},
		weekly: {
			type: Boolean,
			default: false,
		},
		biWeekly: {
			type: Boolean,
			default: false,
		},
		monthly: {
			type: Boolean,
			default: false,
		},
	},
	quantity: {
		type: Number,
		required: true,
	},
	dateAdded: {
		type: Date,
		required: true,
		default: new Date(),
	},
	prescriber: String,
	associatedDrug: { type: Schema.Types.ObjectId, ref: 'Drug' },
	medicationIntakes: [{ type: Schema.Types.ObjectId, ref: 'MedicationIntake' }],
});

MedicationIntakeSchema.index({ medication: 1, profile: 1 });

module.exports = {
	Medication: mongoose.model('Medication', MedicationSchema),
	MedicationIntake: mongoose.model('MedicationIntake', MedicationIntakeSchema),
	MedicationSchema: MedicationSchema
};