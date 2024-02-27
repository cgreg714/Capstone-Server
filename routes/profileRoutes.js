const router = require('express').Router();
const profileController = require('../controllers/profileController');
const doctorController = require('../controllers/doctorController');

router.route('/:userId/profile/')
    .get(profileController.getAllProfiles)
    .post(profileController.createProfile);

router.route('/:userId/profile/:profileId')
    .get(profileController.getProfile)
    .patch(profileController.updateProfile)
    .delete(profileController.deleteProfile);

// Doctors
router.route('/:userId/profile/:profileId/doctors')
    .get(doctorController.getAllDoctors)
    .post(doctorController.createDoctor);

router.route('/:userId/profile/:profileId/doctors/:doctorId')
    .get(doctorController.getOneDoctor)
    .patch(doctorController.updateDoctor)
    .delete(doctorController.deleteDoctor);

// Notifications
router.route('/:userId/profile/:profileId/notifications')
    .get(profileController.getAllNotifications)
    .post(profileController.createNotification)
    .delete(profileController.deleteAllNotifications);

router.route('/:userId/profile/:profileId/notifications/:notificationId')
    .get(profileController.getOneNotification)
    .patch(profileController.updateNotification)
    .delete(profileController.deleteNotification);
module.exports = router;