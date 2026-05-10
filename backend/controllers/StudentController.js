const StudentModel = require('../models/StudentModel');
const { validateStudent } = require('../validations/studentValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class StudentController {
  async getAllStudents(req, res) {
    try {
      const students = await StudentModel.findAll();
      return sendSuccess(res, students);
    } catch (error) {
      return sendError(res, 'Failed to fetch students', error.message);
    }
  }

  async getStudentById(req, res) {
    try {
      const student = await StudentModel.findById(req.params.id);
      if (!student) return sendError(res, 'Student not found', [], 404);
      return sendSuccess(res, student);
    } catch (error) {
      return sendError(res, 'Failed to fetch student', error.message);
    }
  }

  async createStudent(req, res) {
    try {
      const validation = validateStudent(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const { name, address, birthday } = req.body;
      const existingStudent = await StudentModel.findByNameAndInfo(name, address, birthday);
      if (existingStudent) {
        return sendError(res, 'Student already exists', [], 400);
      }

      const newId = await StudentModel.generateNextId();
      const newStudent = await StudentModel.create({
        id: newId,
        ...req.body,
        total_funds: req.body.total_funds || 0,
        current_balance: req.body.current_balance || 0,
      });

      return sendSuccess(res, newStudent, 'Student created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create student', error.message);
    }
  }

  async updateStudent(req, res) {
    try {
      const validation = validateStudent(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedStudent = await StudentModel.update(req.params.id, req.body);
      if (!updatedStudent) return sendError(res, 'Student not found', [], 404);

      return sendSuccess(res, updatedStudent, 'Student updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update student', error.message);
    }
  }

  async deleteStudent(req, res) {
    try {
      const success = await StudentModel.delete(req.params.id);
      if (!success) return sendError(res, 'Student not found', [], 404);
      
      return sendSuccess(res, null, 'Student deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete student', error.message);
    }
  }
}

module.exports = new StudentController();
