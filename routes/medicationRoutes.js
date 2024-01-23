const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');

router.route('/')
    .post(medicationController.postMedication)
    .get(medicationController.getMedication)
    .delete(medicationController.deleteAll);

router.route('/:id')
    .get(medicationController.getByID)
    .patch(medicationController.patchByID)
    .delete(medicationController.deleteByID);

router.route('/prescriber/:prescriber')
    .get(medicationController.getByPrescriber);

router.route('/name/:name')
    .get(medicationController.getByName);

router.route('/dateAdded/:dateAdded')
    .get(medicationController.getByDate);

module.exports = router;