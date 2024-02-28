const router = require('express').Router();
const profileController = require('../controllers/profileController');

router.route('/:userId/profile/')
    .get(profileController.getAllProfiles)
    .post(profileController.createProfile);

router.route('/:userId/profile/:profileId')
    .get(profileController.getProfile)
    .patch(profileController.updateProfile)
    .delete(profileController.deleteProfile);

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