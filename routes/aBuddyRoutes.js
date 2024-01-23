const router = require('express').Router();
const abuddyController = require('../controllers/abuddyController');

router.route('/')
    .post(abuddyController.create)
    .get(abuddyController.getAll);

router.route('/:id')
    .get(abuddyController.getOne)
    .put(abuddyController.update)
    .delete(abuddyController.delete);

module.exports = router;