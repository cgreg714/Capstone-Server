const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    description: String,
    dosages: String,
    frequency: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    dateAdded: {
        type: Date,
        required: true,
        default: new Date()
    },
    prescriber: String,
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
    associatedDrug: {type: Schema.Types.ObjectId, ref: 'Drug'}
});

module.exports = mongoose.model('Medication', MedicationSchema);