const router = require('express').Router();
const AuthController = require('../controllers/authController');

router.post('/signup', (req, res, next) => {
    AuthController.signup(req, res, next);
});
router.post('/login', (req, res, next) => {
    AuthController.login(req, res, next);
});
router.get('/logout', (req, res, next) => {
    AuthController.logout(req, res, next);
});

router.get('/check-token', (req, res, next) => {
    AuthController.checkToken(req, res, next);
});


module.exports = router;