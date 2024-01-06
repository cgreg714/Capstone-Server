const router = require('express').Router();
const Medication = require('../models/medication.model');
const error = require('../helpers/index');

/////toDO Add
router.post('/', async(req,res) => {
    try {
        //pull data
        const {
            medName, frequency, quantity, dose, prescriber, timeOfDay, description
        } = req.body;
        //create new object
        const medication = new Medication({
            medName, frequency, quantity, dose, prescriber, timeOfDay, description, //id: req.user._id
        });
        //save object to db
        const newMed = await medication.save();
        //response
        res.status(200).json({
            message: `${newMed.medName} added`,
            newMed
        })
    } catch (err) {
        error(res,err);
    }
})
/////toDo Get All
router.get('/', async(req,res) => {
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
})
/////toDo Get All By Prescriber Name
router.get('/prescriber/:prescriber', async(req,res) => {
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
})
/////toDo Patch
router.patch('/:id', async(req,res) => {
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
})
/////toDo Delete
router.delete('/:id', async(req,res) => {
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
})

module.exports = router;