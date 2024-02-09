const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/response');

exports.getAllDrugs = async (req, res, next) => {
    try {
        const drugs = await models.Drug.find();
        success(res, drugs);
    } catch (err) {
        next(err);
    }
};

exports.getDrugByDrugbankId = async (req, res, next) => {
    try {
        const drug = await models.Drug.findOne({ 'drugbank-id.0': req.params.id });
        success(res, drug);
    } catch (err) {
        next(err);
    }
};

exports.getDrugByUnii = async (req, res, next) => {
    try {
        const drug = await models.Drug.findOne({ unii: req.params.unii });
        success(res, drug);
    } catch (err) {
        next(err);
    }
};

exports.getInteractionBetweenTwoDrugs = async (req, res, next) => {
    try {
        const drug = await models.Drug.findOne({ 'drugbank-id.0': req.params.drugId1 });
        if (!drug) {
            return incomplete(res, 'Drug not found');
        }

        if (!Array.isArray(drug['drug-interactions'])) {
            return incomplete(res, 'Interactions not found');
        }

        const interactions = drug['drug-interactions'];

        const interaction = interactions.find(
            interaction => interaction['drugbank-id'] === req.params.drugId2
        );

        if (!interaction) {
            return incomplete(res, 'Interaction not found');
        }

        success(res, interaction);
    } catch (err) {
        next(err);
    }
};

exports.searchDrugsByName = async (req, res, next) => {
    try {
        const searchQuery = req.query.q;
        const drugs = await models.Drug.find({ name: new RegExp(searchQuery, 'i') });
        success(res, drugs);
    } catch (err) {
        next(err);
    }
};

exports.searchDrugsByProductName = async (req, res, next) => {
    try {
        const searchQuery = req.query.q;
        const drugs = await models.Drug.find({ 'products.name': new RegExp(searchQuery, 'i') }).limit(10);
        success(res, drugs);
    } catch (err) {
        next(err);
    }
};