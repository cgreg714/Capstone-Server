const express = require('express');
const router = express.Router({ mergeParams: true });
const medicationController = require('../controllers/medicationController');

router.route('/')
    .get(medicationController.getAllMedications)
    .post(medicationController.createMedication)
    .delete(medicationController.deleteAllMedications);

router.route('/:medId')
    .get(medicationController.getMedicationById)
    .patch(medicationController.updateMedication)
    .delete(medicationController.deleteByID);

router.route('/prescriber/:prescriber')
    .get(medicationController.getByPrescriber);

router.route('/name/:name')
    .get(medicationController.getByName);

router.route('/date/:dateAdded')
    .get(medicationController.getByDate);

router.route('/:medId/drugs/:drugId')
    .post(medicationController.addDrugToMedication)
    .delete(medicationController.removeDrugFromMedication);

// Medication intake
router.route('/:medId/intake')
    .get(medicationController.getAllIntakes)
    .post(medicationController.createIntake)
    .delete(medicationController.deleteAllIntakes);

router.route('/:medId/intake/:intakeId')
    .get(medicationController.getIntake)
    .patch(medicationController.updateIntake)
    .delete(medicationController.deleteIntake);

module.exports = router;