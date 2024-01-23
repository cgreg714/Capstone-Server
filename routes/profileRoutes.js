const router = require('express').Router();
const ProfileController = require('../controllers/profileController');

router.route('/')
    .get(ProfileController.getAllProfiles)
    .post(ProfileController.createProfile);

router.route('/:id')
    .get(ProfileController.getProfile)
    .put(ProfileController.updateProfile)
    .delete(ProfileController.deleteProfile);

module.exports = router;