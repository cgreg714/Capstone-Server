const router = require('express').Router({ mergeParams: true });
const abuddyController = require('../controllers/abuddyController');

router.route('/')
    .post(abuddyController.createABuddy)
    .get(abuddyController.getAllABuddies);

router.route('/:buddyId')
    .get(abuddyController.getOneABuddy)
    .patch(abuddyController.updateABuddy)
    .delete(abuddyController.deleteABuddy);

module.exports = router;