const DrugInteraction = require('../models/DrugInteractionsModel');
const Medication = require('../models/MedicationModel');
const error = require('../helpers/index');

exports.DrugInteraction = async(req,res) => {
    try {
        const drugInteraction = req.body.drug-interaction;
        const { Medication } = req.params;
        const medCheck = await Medication.find({_id: medication});

        if(!medCheck) throw new Error('Medication not found');

        const interaction = new DrugInteraction({
            drugInteraction
        });
        const interactionAdded = await interaction.save();

        const forMedication = {
            "drugbank-id": interactionAdded.drugbank-id,
            name: interactionAdded.name,
            description: interactionAdded.description
        }

        await Medication.findOneAndUpdate(
            {_id: medication},
            {$push: {interactionsAdded: forMedication}}
        )

        res.status(200).json({
            results: interactionAdded
        })
    } catch (err) {
        error(res,err);
    }
}
