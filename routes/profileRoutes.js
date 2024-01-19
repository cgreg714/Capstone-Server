const router = require('express').Router();
const ProfileController = require('../controllers/profileController');

router.get('/', (req, res, next) => {
    ProfileController.getAllProfiles(req, res, next);
});

router.get('/:id', (req, res, next) => {
    ProfileController.getProfile(req, res, next);
});

router.post('/', (req, res, next) => {
    ProfileController.createProfile(req, res, next);
});

router.put('/:id', (req, res, next) => {
    ProfileController.updateProfile(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    ProfileController.deleteProfile(req, res, next);
});

module.exports = router;