const express = require('express');
const router = express.Router();
const DrugController = require('../controllers/drugController');

router.get('/', (req, res, next) => {
    DrugController.getAllDrugs(req, res, next);
});

router.get('/:id/interactions/:interactionId', (req, res, next) => {
    DrugController.getSpecificDrugInteractionByDrugbankId(req, res, next);
});

router.get('/drugbank-id/:id', (req, res, next) => {
    DrugController.getDrugByDrugbankId(req, res, next);
});

router.get('/unii/:unii', (req, res, next) => {
    DrugController.getDrugByUnii(req, res, next);
});

module.exports = router;