const router = require('express').Router({ mergeParams: true });
const pharmacyController = require('../controllers/pharmacyController');

router.route('/:userId/profile/:profileId/pharmacy/')
    .post(pharmacyController.createPharmacy)
    .get(pharmacyController.getAllPharmacies);

router.route('/:userId/profile/:profileId/pharmacy/:pharmacyId')
    .get(pharmacyController.getOnePharmacy)
    .patch(pharmacyController.updatePharmacy)
    .delete(pharmacyController.deletePharmacy);

module.exports = router;