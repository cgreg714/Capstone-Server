const Medication = require('../models/medicationModel');
const error = require('../helpers/index');
const router = require('express').Router();



/////toDO Add
exports.postMedication = async(req,res) => {
    console.log(req);
    try {
        //pull data
         const {
              name, description, dosages, frequency, quantity, dateAdded, prescriber, timeOfDay
         } = req.body;
        //create new object
        const medication = new Medication({
            name, description, dosages, frequency, quantity, dateAdded: new Date(), prescriber, timeOfDay, //id: req.user._id
        });
        //save object to db
        const newMed = await medication.save();
        //response
        res.status(200).json({
            message: `${newMed.name} added`,
            newMed
        })
    } catch (err) {
        error(res,err);
    }
};
/////toDo Get All
exports.getMedication = async(req,res) => {
    console.log(req);
    try {
        const allMeds = await Medication.find();

        allMeds ?
        res.status(200).json({
            result: allMeds
        }):
        res.status(404).json({
            result:"No medications found"
        })
    } catch (err) {
        error(res,err);
    }
};
// /////toDo Get All By Prescriber Name
exports.getByPrescriber = async(req,res) => {
    try {
        console.log('prescriber route');
        const { prescriber } = req.params;
        const medPrescriber = await Medication.find({prescriber: prescriber});
    
        if (medPrescriber.length === 0) throw new Error('No prescriber found');
    
        res.status(200).json({
            results: medPrescriber
        });
    } catch (err) {
        error(res,err);
    }
};
/////toDo Get One By ID
exports.getByID = async(req,res) => {
    try {
        const { id } = req.params;
        const getMed = await Medication.findOne({_id: id});
        if(!getMed) throw new Error('no medication found');
        res.status(200).json({
            results: getMed
        })
    } catch (err) {
        error(res,err);
    }
};
// ////toDo Get by Medication Name
exports.getByName = async(req,res) => {
    try {
        const { name } =req.params;
        const medicationName = await Medication.find({name: name});
    
        if (medicationName.length === 0) throw new Error('No medication found by that name');
    
        res.status(200).json({
            results: medicationName
        });
    } catch (err) {
        error(res,err);
    }
};
// /////toDo Patch
exports.patchByID = async(req,res) => {
    try {
        const filter = {
            _id: req.params.id
        };
        const info = req.body;
        const returnOption = {new: true};
        const updated = await Medication.findByIdAndUpdate(filter, info, returnOption);
        res.status(200).json({
            results:updated,
            message:"medication updated"
        });
    } catch (err) {
        error(res,err);
    }
};
// /////toDo Delete
exports.deleteByID = async(req,res) => {
    try {
        const { id } = req.params;
        const deleteMed = await Medication.deleteOne({_id: id});
        console.log(deleteMed);
        deleteMed.deletedCount ?
        res.status(200).json({
            result: 'Medication Deleted'
        }):
        res.status(404).json({
            results:"No medication in collection"
        });
    } catch (err) {
        error(res,err);
    }
};

// //toDo get by date/time Added
exports.getByDate = async(req,res) => {
    try {
        const { dateAdded } =req.params;
        const getByDate = await Medication.find({dateAdded: dateAdded});

        if (getByDate.length === 0) throw new Error('No medication found');
        res.status(200).json({
            results: getByDate
        });
    } catch (err) {
        error(res,err);
    }
};

// ////toDo DELETE all
exports.deleteAll = async(req,res) => {
    console.log(req);
    try {
        const deleteAll = await Medication.deleteMany();
        res.status(200).json({
            message: "All meds cleared"
        });
    } catch (err) {
        error(res,err);
    }
};