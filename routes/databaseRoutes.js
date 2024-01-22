const router = require('express').Router();
const DatabaseController = require('../controllers/databaseController');

router.get('/getDatabases', (req, res, next) => {
	DatabaseController.getDatabases(req, res, next);
});

router.delete('/deleteDatabase/:databaseName', (req, res, next) => {
	DatabaseController.deleteDatabase(req, res, next);
});

module.exports = router;