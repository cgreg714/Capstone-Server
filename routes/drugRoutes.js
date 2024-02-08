const router = require('express').Router();
const DrugController = require('../controllers/drugController');

router.get('/drugs', (req, res, next) => {
	DrugController.getAllDrugs(req, res, next);
});

router.get('/drugs/:drugId/interactions/:interactionId', (req, res, next) => {
	DrugController.getSpecificDrugInteractionByDrugbankId(req, res, next);
});

router.get('/drugs/drugbank-id/:id', (req, res, next) => {
	DrugController.getDrugByDrugbankId(req, res, next);
});

router.get('/drugs/unii/:unii', (req, res, next) => {
	DrugController.getDrugByUnii(req, res, next);
});

router.get('/drugs/search-drugs', (req, res, next) => {
	DrugController.searchDrugs(req, res, next);
});

module.exports = router;