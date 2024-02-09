const router = require('express').Router();
const profileController = require('../controllers/profileController');
const doctorController = require('../controllers/doctorController');

router.route('/')
    .get(profileController.getAllProfiles)
    .post(profileController.createProfile);

router.route('/:profileId')
    .get(profileController.getProfile)
    .put(profileController.updateProfile)
    .delete(profileController.deleteProfile);

// Doctors
router.route('/:profileId/doctors')
    .get(doctorController.getAllDoctors)
    .post(doctorController.createDoctor);

router.route('/:profileId/doctors/:doctorId')
    .get(doctorController.getOneDoctor)
    .put(doctorController.updateDoctor)
    .delete(doctorController.deleteDoctor);

module.exports = router;