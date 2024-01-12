const express = require('express');
const router = express.Router();
const drugInteractionController = require('../controllers/DrugInteractionsController');

router.post('/:medication', drugInteractionController.postInteraction);

module.exports = router;