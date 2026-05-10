const UserModel = require('../models/UserModel');
const { validateUser } = require('../validations/userValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      return sendSuccess(res, users);
    } catch (error) {
      return sendError(res, 'Failed to fetch users', error.message);
    }
  }

  async getUserById(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return sendError(res, 'User not found', [], 404);
      return sendSuccess(res, user);
    } catch (error) {
      return sendError(res, 'Failed to fetch user', error.message);
    }
  }

  async createUser(req, res) {
    try {
      const validation = validateUser(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const existingUser = await UserModel.findByEmail(req.body.email);
      if (existingUser) {
        return sendError(res, 'Email already exists', [], 400);
      }

      const newId = await UserModel.generateNextId(req.body.role_id);
      const newUser = await UserModel.create({
        id: newId,
        ...req.body,
        status: 'active'
      });

      return sendSuccess(res, newUser, 'User created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create user', error.message);
    }
  }

  async updateUser(req, res) {
    try {
      const validation = validateUser(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedUser = await UserModel.update(req.params.id, req.body);
      if (!updatedUser) return sendError(res, 'User not found', [], 404);

      return sendSuccess(res, updatedUser, 'User updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update user', error.message);
    }
  }

  async deleteUser(req, res) {
    try {
      const success = await UserModel.delete(req.params.id);
      if (!success) return sendError(res, 'User not found', [], 404);
      
      return sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete user', error.message);
    }
  }
}

module.exports = new UserController();
