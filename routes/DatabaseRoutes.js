const express = require('express');
const router = express.Router();
const DatabaseController = require('../controllers/DatabaseController');

router.get('/getDatabases', (req, res, next) => {
	DatabaseController.getDatabases(req, res, next);
});

router.delete('/deleteDatabase/:databaseName', (req, res, next) => {
	DatabaseController.deleteDatabase(req, res, next);
});

module.exports = router;