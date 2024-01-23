const router = require('express').Router();
const ProfileController = require('../controllers/profileController');

router.route('/')
    .get(ProfileController.getAllProfiles)
    .post(ProfileController.createProfile);

router.route('/:id')
    .get(ProfileController.getProfile)
    .patch(ProfileController.updateProfile)
    .delete(ProfileController.deleteProfile);

module.exports = router;