const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicationSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: String,
	dosages: String,
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
});

module.exports = MedicationSchema;