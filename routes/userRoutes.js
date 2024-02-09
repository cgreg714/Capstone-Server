const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate, requireRole } = require('../middlewares/auth');

router.route('/')
    .get(authenticate, UserController.getAllUsers);

router.route('/:userId')
    .get(authenticate, UserController.getOneUser)
    .put(authenticate, UserController.updateUser)
    .delete(authenticate, UserController.deleteUser);

router.post('/:userId/addProfile/:profileId', authenticate, UserController.addProfileToUser);
router.post('/:userId/removeProfile/:profileId', authenticate, UserController.removeProfileFromUser);

router.route('/:userId/changeUserRole')
    .patch(authenticate, requireRole('root'), UserController.changeUserRole);

module.exports = router;