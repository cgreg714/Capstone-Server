const router = require('express').Router();
const DrugController = require('../controllers/drugController');

router.get('/', DrugController.getAllDrugs);
router.get('/:drugId1/interactions/:drugId2', DrugController.getInteractionBetweenTwoDrugs);
router.get('/drugbank-id/:id', DrugController.getDrugByDrugbankId);
router.get('/unii/:unii', DrugController.getDrugByUnii);
router.get('/searchDrugsByName', DrugController.searchDrugsByName);
router.get('/searchDrugsByProductName', DrugController.searchDrugsByProductName);

module.exports = router;