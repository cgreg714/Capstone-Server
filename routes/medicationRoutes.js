const express = require('express');
const router = express.Router({ mergeParams: true });
const medicationController = require('../controllers/medicationController');
const medicationIntakeController = require('../controllers/medicationIntakeController');

router.route('/:userId/profile/:profileId/medications/')
    .get(medicationController.getAllMedications)
    .post(medicationController.createMedication)
    .delete(medicationController.deleteAllMedications);

router.route('/:userId/profile/:profileId/medications/:medId')
    .get(medicationController.getMedicationById)
    .patch(medicationController.updateMedication)
    .delete(medicationController.deleteByID);

router.patch('/:userId/profile/:profileId/medications/:medId/addQuantity', medicationController.addQuantity);

router.route('/:userId/profile/:profileId/medications/prescriber/:prescriber')
    .get(medicationController.getByPrescriber);

router.route('/:userId/profile/:profileId/medications/name/:name')
    .get(medicationController.getByName);

router.route('/:userId/profile/:profileId/medications/date/:dateAdded')
    .get(medicationController.getByDate);

// router.route('/:userId/profile/:profileId/medications/:medId/drugs/:drugId')
//     .post(medicationController.addDrugToMedication)
//     .delete(medicationController.removeDrugFromMedication);

// Medication intake
router.route('/:userId/profile/:profileId/medications/:medId/intake')
    .get(medicationIntakeController.getAllIntakes)
    .post(medicationIntakeController.createIntake)
    .delete(medicationIntakeController.deleteAllIntakes);

router.route('/:userId/profile/:profileId/medications/:medId/intake/:intakeId')
    .get(medicationIntakeController.getIntake)
    .patch(medicationIntakeController.updateIntake)
    .delete(medicationIntakeController.deleteIntake);

router.route('/:userId/profile/:profileId/medications/:medId/toggle/:field')
    .patch(medicationController.toggleField);

module.exports = router;