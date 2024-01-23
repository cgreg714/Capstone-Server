const router = require('express').Router();
const profileController = require('../controllers/profileController');

router.route('/')
    .get(profileController.getAllProfiles)
    .post(profileController.createProfile);

router.route('/:id')
    .get(profileController.getProfile)
    .patch(profileController.updateProfile)
    .delete(profileController.deleteProfile);

    
router.post('/:profileId/doctors', profileController.addDoctorToProfile);
router.delete('/:profileId/doctors/:doctorId', profileController.removeDoctorFromProfile);

router.post('/:profileId/meds', profileController.addMedsToProfile);
router.delete('/:profileId/meds/:medId', profileController.removeMedsFromProfile);
    
module.exports = router;