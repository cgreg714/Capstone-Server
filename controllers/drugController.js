const models = require('../models/databaseModel');
const { error, success, incomplete } = require('../helpers/response');

exports.getAllDrugs = async (req, res) => {
    try {
        const drugs = await models.Drug.find();
        success(res, drugs);
    } catch (err) {
        error(res, err);
    }
};

exports.getDrugByDrugbankId = async (req, res) => {
    try {
        const drug = await models.Drug.findOne({ 'drugbank-id.0': req.params.id });
        success(res, drug);
    } catch (err) {
        error(res, err);
    }
};

exports.getDrugByUnii = async (req, res) => {
    try {
        const drug = await models.Drug.findOne({ unii: req.params.unii });
        success(res, drug);
    } catch (err) {
        error(res, err);
    }
};

exports.getSpecificDrugInteractionByDrugbankId = async (req, res) => {
    try {
        const drug = await models.Drug.findOne({ 'drugbank-id.0': req.params.id });
        if (!drug) {
            return incomplete(res, 'Drug not found');
        }

        if (!Array.isArray(drug['drug-interactions'])) {
            return incomplete(res, 'Interactions not found');
        }

        const interactions = drug['drug-interactions'];

        const interaction = interactions.find(
            interaction => interaction['drugbank-id'] === req.params.interactionId
        );

        if (!interaction) {
            return incomplete(res, 'Interaction not found');
        }

        success(res, interaction);
    } catch (err) {
        error(res, err);
    }
};

exports.searchDrugs = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const drugs = await models.Drug.find({ name: new RegExp(searchQuery, 'i') });
        success(res, drugs);
    } catch (err) {
        error(res, err);
    }
};