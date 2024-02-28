const router = require('express').Router();
const doctorController = require('../controllers/doctorController');

// Doctors
router.route('/:userId/profile/:profileId/doctors')
    .get(doctorController.getAllDoctors)
    .post(doctorController.createDoctor);

router.route('/:userId/profile/:profileId/doctors/:doctorId')
    .get(doctorController.getOneDoctor)
    .patch(doctorController.updateDoctor)
    .delete(doctorController.deleteDoctor);

module.exports = router;