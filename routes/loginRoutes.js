const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/loginController');

router.post('/signup', (req, res, next) => {
    LoginController.signup(req, res, next);
});
router.post('/login', (req, res, next) => {
    LoginController.login(req, res, next);
});
router.get('/logout', (req, res, next) => {
    LoginController.logout(req, res, next);
});

module.exports = router;