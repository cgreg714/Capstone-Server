const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate, requireRole } = require('../middlewares/auth');

router.route('/:userId')
    .get(authenticate, UserController.getUser)
    .put(authenticate, UserController.updateUser)
    .delete(authenticate, UserController.deleteUser);

router.route('/')
    .get(authenticate, UserController.getAllUsers);

router.route('/changeUserRole')
    .patch(authenticate, requireRole('root'), UserController.changeUserRole);

module.exports = router;