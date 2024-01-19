const router = require('express').Router();
const medicationController = require('../controllers/medicationController');
const error = require('../helpers/index');

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

module.exports = router;