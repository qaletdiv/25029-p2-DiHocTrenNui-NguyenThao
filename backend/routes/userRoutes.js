const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authorize = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Users
router.get('/', authorize(ACTIONS.READ, RESOURCES.USER), UserController.getAllUsers);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.USER), UserController.getUserById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.USER), UserController.createUser);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.USER), UserController.updateUser);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.USER), UserController.deleteUser);

module.exports = router;
