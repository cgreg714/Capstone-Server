const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/MedicationController');

//add medication
router.post('/', medicationController.postMedication);

//get all medications
router.get('/',medicationController.getMedication);

//get by prescriber name
router.get('/prescriber/:prescriber', medicationController.getByPrescriber);

//get by ID
router.get('/find-one/:id', medicationController.getByID);

//get by med name
router.get('/name/:name', medicationController.getByName);

//patch by ID
router.patch('/:id', medicationController.patchByID);

//delete by ID
router.delete('/:id', medicationController.deleteByID);

//get by date
router.get('/dateAdded/:dateAdded', medicationController.getByDate);

//delete all
router.delete('/clear', medicationController.deleteAll);

//get by time of day
// router.get('/time-of-day/:timeOfDay', medicationController.getByTimeOfDay);
router.route('/:medId/toggle/:field')
    .patch(medicationController.toggleField);
//get by day of the week
router.get('/day-of-the-week/:dayOfTheWeek', medicationController.getByDayOfTheWeek);

module.exports = router;