const mongoose = require('mongoose');

const DrugInteractionSchema = new mongoose.Schema({
    "drug-interaction": {
        0: {
            "drugbank-id": String,
            name: String,
            description: String,
        },
        drug_id: {
            type: mongoose.Types.ObjectId,
            ref:"Medication"
        }
    }
});

module.exports = mongoose.model('DrugInteraction', DrugInteractionSchema);