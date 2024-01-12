const mongoose = require('mongoose');

const DrugInteractionSchema = new mongoose.Schema({
    'drugbank-id': String,
    name: String,
    description: String
}, {_id: false});

const DrugProductSchema = new mongoose.Schema({
    name: String,
    labeller: String,
    'dosage-form': String,
    strength: String,
    route: String,
    country: String
}, {_id: false});

const DrugFoodInteractionSchema = new mongoose.Schema({
    'food-interaction': String
}, {_id: false});

const DrugExternalLinkSchema = new mongoose.Schema({
    resource: String,
    url: String
}, {_id: false});

const DrugSchema = new mongoose.Schema({
    'drugbank-id': {
        '0': String,
        '1': String,
        '2': String
    },
    name: String,
    description: String,
    unii: String,
    indication: String,
    'mechanism-of-action': String,
    products: [DrugProductSchema],
    'food-interactions': { type: Map, of: DrugFoodInteractionSchema },
    'drug-interactions': { type: Map, of: DrugInteractionSchema },
    "external-links": { type: Map, of: DrugExternalLinkSchema },
});

const Drug = mongoose.model('Drug', DrugSchema, 'drugDB');

module.exports = { Drug, DrugSchema };