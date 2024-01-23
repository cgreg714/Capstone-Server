const Medication = require('../models/medicationModel');
const helpers = require('../helpers/errorResponse');

exports.postMedication = async(req,res) => {
    try {
        const { name, description, dosages, frequency, quantity, dateAdded, prescriber, timeOfDay } = req.body;
        const medication = new Medication({ name, description, dosages, frequency, quantity, dateAdded: new Date(), prescriber, timeOfDay });
        const newMed = await medication.save();
        res.status(200).json(newMed);
    } catch (err) {
        helpers.error(res, err);
    }
};

exports.getMedication = async(req,res) => {
    try {
        const allMeds = await Medication.find();
        res.status(200).json(allMeds.length > 0 ? allMeds : "No medications found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByPrescriber = async(req,res) => {
    try {
        const { prescriber } = req.params;
        const medPrescriber = await Medication.find({prescriber: prescriber});
        res.status(200).json(medPrescriber.length > 0 ? medPrescriber : "No prescriber found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByID = async(req,res) => {
    try {
        const { id } = req.params;
        const getMed = await Medication.findOne({_id: id});
        res.status(200).json(getMed ? getMed : "No medication found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByName = async(req,res) => {
    try {
        const { name } =req.params;
        const medicationName = await Medication.find({name: name});
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
        const updated = await Medication.findByIdAndUpdate(filter, info, returnOption);
        res.status(200).json(updated ? updated : "No medication found to update");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.deleteByID = async(req,res) => {
    try {
        const { id } = req.params;
        const deleteMed = await Medication.deleteOne({_id: id});
        res.status(200).json(deleteMed.deletedCount ? 'Medication Deleted' : "No medication in collection");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.getByDate = async(req,res) => {
    try {
        const { dateAdded } =req.params;
        const getByDate = await Medication.find({dateAdded: dateAdded});
        res.status(200).json(getByDate.length > 0 ? getByDate : "No medication found");
    } catch (err) {
        helpers.error(res,err);
    }
};

exports.deleteAll = async(req,res) => {
    try {
        const deleteAll = await Medication.deleteMany();
        res.status(200).json("All meds cleared");
    } catch (err) {
        helpers.error(res,err);
    }
};