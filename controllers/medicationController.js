const models = require('../models/databaseModel');
const helpers = require('../helpers/errorResponse');

exports.postMedication = async(req,res) => {
    try {
        const { name, description, dosages, frequency, quantity, dateAdded, prescriber, timeOfDay } = req.body;
        const medication = new models.Medication({ name, description, dosages, frequency, quantity, dateAdded: new Date(), prescriber, timeOfDay });
        const newMed = await medication.save();
        res.status(200).json(newMed);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getMedication = async(req,res) => {
    try {
        const allMeds = await models.Medication.find();
        res.status(200).json(allMeds.length > 0 ? allMeds : "No medications found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByPrescriber = async(req,res) => {
    try {
        const { prescriber } = req.params;
        const medPrescriber = await models.Medication.find({prescriber: prescriber});
        res.status(200).json(medPrescriber.length > 0 ? medPrescriber : "No prescriber found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByID = async(req,res) => {
    try {
        const { id } = req.params;
        const getMed = await models.Medication.findOne({_id: id});
        res.status(200).json(getMed ? getMed : "No medication found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByName = async(req,res) => {
    try {
        const { name } =req.params;
        const medicationName = await models.Medication.find({name: name});
        res.status(200).json(medicationName.length > 0 ? medicationName : "No medication found by that name");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.patchByID = async(req,res) => {
    try {
        const filter = { _id: req.params.id };
        const info = req.body;
        const returnOption = {new: true};
        const updated = await models.Medication.findByIdAndUpdate(filter, info, returnOption);
        res.status(200).json(updated ? updated : "No medication found to update");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.deleteByID = async(req,res) => {
    try {
        const { id } = req.params;
        const deleteMed = await models.Medication.deleteOne({_id: id});
        res.status(200).json(deleteMed.deletedCount ? 'Medication Deleted' : "No medication in collection");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByDate = async(req,res) => {
    try {
        const { dateAdded } =req.params;
        const getByDate = await models.Medication.find({dateAdded: dateAdded});
        res.status(200).json(getByDate.length > 0 ? getByDate : "No medication found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.deleteAll = async(req,res) => {
    try {
        const deleteAll = await models.Medication.deleteMany();
        res.status(200).json("All meds cleared");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.addDrugToMedication = async (req, res) => {
    const { medicationId, drugId } = req.params;

    try {
        const medication = await models.Medication.findById(medicationId);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        const drug = await models.Drug.findById(drugId);
        if (!drug) {
            return res.status(404).json({ message: 'Drug not found' });
        }

        medication.associatedDrug = drugId;
        await medication.save();

        res.status(200).json({ message: 'Drug added to medication successfully' });
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.removeDrugFromMedication = async (req, res) => {
    const { medicationId } = req.params;

    try {
        const medication = await models.Medication.findById(medicationId);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        medication.associatedDrug = null;
        await medication.save();

        res.status(200).json({ message: 'Drug removed from medication successfully' });
    } catch (err) {
        helpers.error(res, err);
    }
};