const router = require('express').Router();
const DrugController = require('../controllers/drugController');

router.get('/', (req, res, next) => {
	DrugController.getAllDrugs(req, res, next);
});

router.get('/:drugId1/interactions/:drugId2', (req, res, next) => {
	DrugController.getInteractionBetweenTwoDrugs(req, res, next);
});

router.get('/drugbank-id/:id', (req, res, next) => {
	DrugController.getDrugByDrugbankId(req, res, next);
});

router.get('/unii/:unii', (req, res, next) => {
	DrugController.getDrugByUnii(req, res, next);
});

router.get('/searchDrugsByName', (req, res, next) => {
	DrugController.searchDrugsByName(req, res, next);
});

router.get('/searchByProductName', (req, res, next) => {
	DrugController.searchDrugsByProductName(req, res, next);
});

module.exports = router;
