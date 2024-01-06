const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    medName: {
        type:String,
        required: true
    },
    frequency: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    dose: String,
    prescriber: String,
    timeOfDay: String,
    description: String
});

module.exports = mongoose.model('Medication', MedicationSchema);