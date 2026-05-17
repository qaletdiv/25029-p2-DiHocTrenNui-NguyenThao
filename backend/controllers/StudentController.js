const StudentModel = require('../models/StudentModel');
const { validateStudent } = require('../validations/studentValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const { formatStudentResponse, parseStudentRequest } = require('../utils/formatStudent');

class StudentController {
  async getAllStudents(req, res) {
    try {
      const students = await StudentModel.findAll();
      const formattedStudents = students.map(formatStudentResponse);
      return sendSuccess(res, paginate(formattedStudents, req, 'students'));
    } catch (error) {
      return sendError(res, 'Failed to fetch students', error.message);
    }
  }

  async getStudentById(req, res) {
    try {
      const student = await StudentModel.findById(req.params.id);
      if (!student) return sendError(res, 'Student not found', [], 404);
      return sendSuccess(res, formatStudentResponse(student));
    } catch (error) {
      return sendError(res, 'Failed to fetch student', error.message);
    }
  }

  async createStudent(req, res) {
    try {
      const parsedBody = parseStudentRequest(req.body);
      const validation = validateStudent(parsedBody);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const { full_name, address_id, date_of_birth } = parsedBody;
      const existingStudent = await StudentModel.findByNameAndInfo(full_name, address_id, date_of_birth);
      if (existingStudent) {
        return sendError(res, 'Student already exists', [], 400);
      }

      const newId = await StudentModel.generateNextId(address_id);
      const newStudent = await StudentModel.create({
        id: newId,
        ...parsedBody,
        monthly_amount: parsedBody.monthly_amount || 500000,
      });


      return sendSuccess(res, formatStudentResponse(newStudent), 'Student created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create student', error.message);
    }
  }

  async updateStudent(req, res) {
    try {
      const parsedBody = parseStudentRequest(req.body);
      const validation = validateStudent(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedStudent = await StudentModel.update(req.params.id, parsedBody);
      if (!updatedStudent) return sendError(res, 'Student not found', [], 404);

      return sendSuccess(res, formatStudentResponse(updatedStudent), 'Student updated successfully');
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
