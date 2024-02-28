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
    'drugbank-id': String,
    name: { type: String, index: true },
    description: String,
    unii: String,
    indication: String,
    'mechanism-of-action': String,
    products: [DrugProductSchema],
    'food-interactions': [DrugFoodInteractionSchema],
    'drug-interactions': [DrugInteractionSchema],
    "external-links": { type: Map, of: DrugExternalLinkSchema },
}, { id: false });

DrugSchema.index({ name: 'text' });
DrugSchema.index({ 'drugbank-id': 1 });
DrugSchema.index({ 'products.name': 'text' });

const Drug = mongoose.model('Drug', DrugSchema, 'drugDB');

module.exports = Drug;