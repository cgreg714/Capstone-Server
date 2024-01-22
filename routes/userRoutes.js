const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate, requireRole } = require('../middlewares/auth');

router.get('/:userId', authenticate, (req, res, next) => {
    UserController.getUser(req, res, next);
});

router.get('/', authenticate, requireRole('admin'), (req, res, next) => {
    UserController.getAllUsers(req, res, next);
});

router.delete('/:userId', authenticate, (req, res, next) => {
    UserController.deleteUser(req, res, next);
});

router.patch('/changeUserRole', authenticate, requireRole('root'), (req, res, next) => {
    UserController.changeUserRole(req, res, next);
});

module.exports = router;