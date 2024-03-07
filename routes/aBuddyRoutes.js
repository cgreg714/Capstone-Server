const router = require('express').Router({ mergeParams: true });
const abuddyController = require('../controllers/abuddyController');

router.route('/:userId/profile/:profileId/aBuddy/')
    .post(abuddyController.createABuddy)
    .get(abuddyController.getAllABuddies);

router.route('/:userId/profile/:profileId/aBuddy/:aBuddyId')
    .get(abuddyController.getOneABuddy)
    .patch(abuddyController.updateABuddy)
    .delete(abuddyController.deleteABuddy);

module.exports = router;