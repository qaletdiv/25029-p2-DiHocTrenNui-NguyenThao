const AccountModel = require('../models/AccountModel');
const { validateAccount } = require('../validations/accountValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class AccountController {
  async getAllAccounts(req, res) {
    try {
      const accounts = await AccountModel.findAll();
      return sendSuccess(res, accounts);
    } catch (error) {
      return sendError(res, 'Failed to fetch accounts', error.message);
    }
  }

  async getAccountById(req, res) {
    try {
      const account = await AccountModel.findById(parseInt(req.params.id));
      if (!account) return sendError(res, 'Account not found', [], 404);
      return sendSuccess(res, account);
    } catch (error) {
      return sendError(res, 'Failed to fetch account', error.message);
    }
  }

  async createAccount(req, res) {
    try {
      const validation = validateAccount(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const existingAccount = await AccountModel.findByEmail(req.body.email);
      if (existingAccount) {
        return sendError(res, 'Email already exists', [], 400);
      }

      const newId = await AccountModel.generateNextId();
      const newAccount = await AccountModel.create({
        id: newId,
        ...req.body,
        is_active: true
      });

      return sendSuccess(res, newAccount, 'Account created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create account', error.message);
    }
  }

  async updateAccount(req, res) {
    try {
      const validation = validateAccount(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedAccount = await AccountModel.update(parseInt(req.params.id), req.body);

      if (!updatedAccount) return sendError(res, 'Account not found', [], 404);

      return sendSuccess(res, updatedAccount, 'Account updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update account', error.message);
    }
  }

  async deleteAccount(req, res) {
    try {
      const success = await AccountModel.delete(parseInt(req.params.id));
      if (!success) return sendError(res, 'Account not found', [], 404);
      
      return sendSuccess(res, null, 'Account deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete account', error.message);
    }
  }
}

module.exports = new AccountController();
