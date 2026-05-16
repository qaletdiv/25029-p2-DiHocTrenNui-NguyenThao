const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Accounts
router.get('/', authorize(ACTIONS.READ, RESOURCES.USER), AccountController.getAllAccounts);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.USER), AccountController.getAccountById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.USER), AccountController.createAccount);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.USER), AccountController.updateAccount);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.USER), AccountController.deleteAccount);

module.exports = router;
