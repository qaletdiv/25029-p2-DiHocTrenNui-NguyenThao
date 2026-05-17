const TeacherModel = require('../models/TeacherModel');
const { validateTeacher } = require('../validations/teacherValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');

class TeacherController {
  async getAllTeachers(req, res) {
    try {
      const teachers = await TeacherModel.findAll();
      return sendSuccess(res, paginate(teachers, req, 'teachers'));
    } catch (error) {
      return sendError(res, 'Failed to fetch teachers', error.message);
    }
  }

  async getTeacherById(req, res) {
    try {
      const teacher = await TeacherModel.findById(parseInt(req.params.id));
      if (!teacher) return sendError(res, 'Teacher not found', [], 404);
      return sendSuccess(res, teacher);
    } catch (error) {
      return sendError(res, 'Failed to fetch teacher', error.message);
    }
  }

  async createTeacher(req, res) {
    try {
      const validation = validateTeacher(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const newId = await TeacherModel.generateNextId();
      const newTeacher = await TeacherModel.create({
        id: newId,
        ...req.body
      });

      return sendSuccess(res, newTeacher, 'Teacher created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create teacher', error.message);
    }
  }

  async updateTeacher(req, res) {
    try {
      const validation = validateTeacher(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedTeacher = await TeacherModel.update(parseInt(req.params.id), req.body);
      if (!updatedTeacher) return sendError(res, 'Teacher not found', [], 404);

      return sendSuccess(res, updatedTeacher, 'Teacher updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update teacher', error.message);
    }
  }

  async deleteTeacher(req, res) {
    try {
      const success = await TeacherModel.delete(parseInt(req.params.id));
      if (!success) return sendError(res, 'Teacher not found', [], 404);
      
      return sendSuccess(res, null, 'Teacher deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete teacher', error.message);
    }
  }
}

module.exports = new TeacherController();
