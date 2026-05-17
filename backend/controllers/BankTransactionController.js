const BankTransactionModel = require('../models/BankTransactionModel');
const { validateBankTransaction } = require('../validations/bankTransactionValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');

class BankTransactionController {
  async getAllTransactions(req, res) {
    try {
      const transactions = await BankTransactionModel.findAll();
      return sendSuccess(res, paginate(transactions, req, 'transactions'));
    } catch (error) {
      return sendError(res, 'Failed to fetch transactions', error.message);
    }
  }

  async getTransactionById(req, res) {
    try {
      const transaction = await BankTransactionModel.findById(parseInt(req.params.id));
      if (!transaction) return sendError(res, 'Transaction not found', [], 404);
      return sendSuccess(res, transaction);
    } catch (error) {
      return sendError(res, 'Failed to fetch transaction', error.message);
    }
  }

  async createTransaction(req, res) {
    try {
      const validation = validateBankTransaction(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const newId = await BankTransactionModel.generateNextId();
      const newTransaction = await BankTransactionModel.create({
        id: newId,
        ...req.body
      });


      return sendSuccess(res, newTransaction, 'Transaction created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create transaction', error.message);
    }
  }

  async updateTransaction(req, res) {
    try {
      const validation = validateBankTransaction(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedTransaction = await BankTransactionModel.update(parseInt(req.params.id), req.body);

      if (!updatedTransaction) return sendError(res, 'Transaction not found', [], 404);

      return sendSuccess(res, updatedTransaction, 'Transaction updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update transaction', error.message);
    }
  }

  async deleteTransaction(req, res) {
    try {
      const success = await BankTransactionModel.delete(parseInt(req.params.id));
      if (!success) return sendError(res, 'Transaction not found', [], 404);
      
      return sendSuccess(res, null, 'Transaction deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete transaction', error.message);
    }
  }
}

module.exports = new BankTransactionController();
