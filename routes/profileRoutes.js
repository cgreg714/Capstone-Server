const router = require('express').Router();
const profileController = require('../controllers/profileController');
const doctorController = require('../controllers/doctorController');

router.route('/')
    .get(profileController.getAllProfiles)
    .post(profileController.createProfile);

router.route('/:id')
    .get(profileController.getProfile)
    .patch(profileController.updateProfile)
    .delete(profileController.deleteProfile);

// Doctors
router.route('/:profileId/doctors')
    .get(doctorController.getAllDoctors)
    .post(doctorController.createDoctor);

router.route('/:profileId/doctors/:doctorId')
    .get(doctorController.getOneDoctor)
    .patch(doctorController.updateDoctor)
    .delete(doctorController.deleteDoctor);

module.exports = router;