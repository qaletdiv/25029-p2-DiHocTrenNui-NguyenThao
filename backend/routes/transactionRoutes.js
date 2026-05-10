const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Transactions
router.get('/', authorize(ACTIONS.READ, RESOURCES.TRANSACTION), TransactionController.getAllTransactions);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.TRANSACTION), TransactionController.getTransactionById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.TRANSACTION), TransactionController.createTransaction);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.TRANSACTION), TransactionController.updateTransaction);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.TRANSACTION), TransactionController.deleteTransaction);

module.exports = router;
