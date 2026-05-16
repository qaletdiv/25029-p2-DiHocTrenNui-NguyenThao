const express = require('express');
const router = express.Router();
const BankTransactionController = require('../controllers/BankTransactionController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Bank Transactions
router.get('/', authorize(ACTIONS.READ, RESOURCES.BANK_TRANSACTION), BankTransactionController.getAllTransactions);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.BANK_TRANSACTION), BankTransactionController.getTransactionById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.BANK_TRANSACTION), BankTransactionController.createTransaction);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.BANK_TRANSACTION), BankTransactionController.updateTransaction);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.BANK_TRANSACTION), BankTransactionController.deleteTransaction);

module.exports = router;
