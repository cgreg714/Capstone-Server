const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const MedicationSchema = new Schema({
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
    timeOfDay: String,
    associatedDrug: { type: Schema.Types.ObjectId, ref: 'Drug' }
});

const Medication = mongoose.model('Medication', MedicationSchema, 'medications');


module.exports = Medication;