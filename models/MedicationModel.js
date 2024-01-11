const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    "drugbank-id":{
        type: Array
    },
    name: {
        type:String,
        required: true
    },
    description: String,
    "cas-number": String,
    //unii: String,
    state: String,
    groups: String,
    "general-references": String,
   // "synthesis-references": String,
    indication: String,
    pharmacodynamics: String,
    //"mechanism-of-action": String,
    toxicity: String,
    metabolism: String,
    absorption: String,
    //"half-life": String,
    "protein-binding": String,
    "route-of-elimination": String,
    "volume-of-distribution": String,
    clearance: String,
    classifications: String,
    //salts: String,
    synonyms: String,
    products: String,
    "international-brands": String,
    mixtures: String,
    //packagers: String,
    manufacturers: String,
    //prices: Number,
    categories: String,
    "affected-organisms": String,
    dosages: String,
    "atc-codes": String,
    "ahfs-codes": String,
    "pdb-entries": String,
    "food-interactions": String,
    "drug-interactions": String,
    sequences: String,
    "experimental-properties": String,
    "external-identifiers": String,
    "external-links": String,
    pathways: String,
    reactions: String,
    "snp-effects": String,
    "snp-adverse-drug-reactions": String,
    targets: String,
    enzymes: String,
    carriers: String,
    transporters: String,
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