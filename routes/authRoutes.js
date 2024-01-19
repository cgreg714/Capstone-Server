const router = require('express').Router();
const authController = require('./authController');

router.post('/signup', (req, res, next) => {
    authController.signup(req, res, next);
});

router.post('/login', (req, res, next) => {
    authController.login(req, res, next);
});

module.exports = router;