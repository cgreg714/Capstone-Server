const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicationIntakeSchema = new Schema({
	quantity: { type: Number, required: true },
	takenAt: { type: Date, required: true },
});

const MedicationSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: String,
	unitOfMeasurement: {
		type: String,
		enum: [null, 'kg', 'g', 'mg', 'mcg', 'L', 'ml', 'cc', 'mol', 'mmol', 'units', 'tbsp', 'tsp'],
		default: null,
	},
	dose: {
		type: Number,
		required: true,
	},
	frequency: {
		time: {
			type: String,
		},
		timeOfDay: {
			morning: Boolean,
			noon: Boolean,
			evening: Boolean,
			bedtime: Boolean,
		},
		dayOfTheWeek: {
			sunday: Boolean,
			monday: Boolean,
			tuesday: Boolean,
			wednesday: Boolean,
			thursday: Boolean,
			friday: Boolean,
			saturday: Boolean,
		},
		day: {
			type: Number,
			min: 1,
			max: 31,
		},
		once: {
			type: Boolean,
			default: false,
		},
		daily: {
			type: Boolean,
			default: false,
		},
		weekly: {
			type: Boolean,
			default: false,
		},
		monthly: {
			type: Boolean,
			default: false,
		},
		everyXHours: {
			type: Number,
			min: 1,
			validate: {
				validator: Number.isInteger,
				message: '{VALUE} is not an integer value',
			},
		},
		customFrequency: {
			type: String,
		},
	},
	quantity: {
		type: Number,
	},
	dateAdded: {
		type: Date,
		required: true,
	},
	// prescriber: String,
	doctor: {
		profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
		doctor: Schema.Types.ObjectId,
	},
	pharmacy: {
		profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
		pharmacy: Schema.Types.ObjectId,
	},
	associatedDrug: { type: Schema.Types.ObjectId, ref: 'Drug' },
	medicationIntakes: [MedicationIntakeSchema],
});

MedicationIntakeSchema.index({ medication: 1, profile: 1 });

module.exports = {
	MedicationSchema: MedicationSchema,
};
