const router = require('express').Router({ mergeParams: true });
const abuddyController = require('../controllers/abuddyController');

router.route('/')
    .post(abuddyController.create)
    .get(abuddyController.getAll);

router.route('/:buddyId')
    .get(abuddyController.getOne)
    .patch(abuddyController.update)
    .delete(abuddyController.delete);

module.exports = router;