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

router.post('/send-otp', (req, res, next) => {
    AuthController.sendPasswordResetEmail(req, res, next);
});

router.post('/verify-otp', (req, res, next) => {
    AuthController.verifyOTP(req, res, next);
});

router.post('/reset-password', (req, res, next) => {
    AuthController.resetPassword(req, res, next);
});

module.exports = router;