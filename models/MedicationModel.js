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
    timeOfDay: String,
    associatedDrug: [Object]
    ////////////* Commented out code underneath should be inside the Drug Interactions Schema /////////
    //this should be in drug schema
    // "drugbank-id":{
        //     0: Number,
        //     1: Number,
        //     2: Number
        // },
    //indication: String,
    //description will be in drug schema
    //unii: Number,
    // products: {
    //     product: {
    //         0: {
    //             name: String,
    //             labeller: String,
    //             "dosage-form": String,
    //             strength: String,
    //             route: String,
    //             country: String
    //         },
    //         1: {
    //             name: String,
    //             labeller: String,
    //             "dosage-form": String,
    //             strength: String,
    //             route: String,
    //             country: String
    //         }
    //     }
    // },
    //food interactions will be in drug schema
    // "food-interactions": {
    //     "food-interaction": String
    // },
    //food interactions and external links will be in drug schema
   // "drug-interactions": [Object],
    // "external-links": {
    //     0: {
    //         resource: String,
    //         url: String
    //     }
    // },
});

module.exports = mongoose.model('Medication', MedicationSchema);