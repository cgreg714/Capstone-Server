const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    //this should be in drug schema
    "drugbank-id":{
        0: Number,
        1: Number,
        2: Number
    },
    name: {
        type:String,
        required: true
    },
    //description will be in drug schema
    description: String,
    unii: Number,
    indication: String,
    products: {
        product: {
            0: {
                name: String,
                labeller: String,
                "dosage-form": String,
                strength: String,
                route: String,
                country: String
            },
            1: {
                name: String,
                labeller: String,
                "dosage-form": String,
                strength: String,
                route: String,
                country: String
            }
        }
    },
    //*make the user to punch in the dosages
    dosages: String,
    //food interactions will be in drug schema
    "food-interactions": {
        "food-interaction": String
    },
    //food interactions and external links will be in drug schema
    "drug-interactions": [Object],
    "external-links": {
        0: {
            resource: String,
            url: String
        }
    },
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
});

module.exports = mongoose.model('Medication', MedicationSchema);