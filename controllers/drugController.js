const models = require('../models/databaseModel');

exports.getDrugByDrugbankId = async (req, res) => {
    try {
        const drug = await models.Drug.findOne({ 'drugbank-id.0': req.params.id });
        res.json(drug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDrugByUnii = async (req, res) => {
    try {
        const drug = await models.Drug.findOne({ unii: req.params.unii });
        res.json(drug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllDrugs = async (req, res) => {
    try {
        const drugs = await models.Drug.find();
        res.json(drugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSpecificDrugInteractionByDrugbankId = async (req, res) => {
    try {
        const drug = await models.Drug.findOne({ 'drugbank-id.0': req.params.id });
        if (!drug) {
            return res.status(404).json({ message: 'Drug not found' });
        }

        if (!Array.isArray(drug['drug-interactions'])) {
            return res.status(404).json({ message: 'Interactions not found' });
        }

        const interactions = drug['drug-interactions'];

        const interaction = interactions.find(
            interaction => interaction['drugbank-id'] === req.params.interactionId
        );

        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }

        res.json(interaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};