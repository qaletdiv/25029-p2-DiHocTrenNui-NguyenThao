const TeacherModel = require('../models/TeacherModel');
const { validateTeacher } = require('../validations/teacherValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const { formatTeacherResponse, parseTeacherRequest } = require('../utils/formatTeacher');

class TeacherController {
  async getAllTeachers(req, res) {
    try {
      const teachers = await TeacherModel.findAll();
      let formattedTeachers = teachers.map(formatTeacherResponse);

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { teacherIds } = getSponsorLinkedResources(req.user.id);
        formattedTeachers = formattedTeachers.filter(t => teacherIds.includes(t.id));
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { teacherId } = getTeacherLinkedResources(req.user.id);
        formattedTeachers = formattedTeachers.filter(t => t.id === teacherId);
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { teacherIds } = getVolunteerLinkedResources(req.user.id);
        formattedTeachers = formattedTeachers.filter(t => teacherIds.includes(t.id));
      }

      console.log("getAllTeachers: \n", formattedTeachers);
      return sendSuccess(res, paginate(formattedTeachers, req, 'teachers'));
    } catch (error) {
      return sendError(res, 'Failed to fetch teachers', error.message);
    }
  }

  async getTeacherById(req, res) {
    try {
      const teacher = await TeacherModel.findById(parseInt(req.params.id));
      if (!teacher) return sendError(res, 'Teacher not found', [], 404);

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { teacherIds } = getSponsorLinkedResources(req.user.id);
        if (!teacherIds.includes(teacher.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { teacherId } = getTeacherLinkedResources(req.user.id);
        if (teacherId !== teacher.id) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { teacherIds } = getVolunteerLinkedResources(req.user.id);
        if (!teacherIds.includes(teacher.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      console.log("getTeacherById: \n", "Id: \n", req.params.id, "\n Teacher: \n", formatTeacherResponse(teacher));
      return sendSuccess(res, formatTeacherResponse(teacher));
    } catch (error) {
      return sendError(res, 'Failed to fetch teacher', error.message);
    }
  }

  async createTeacher(req, res) {
    try {
      const parsedBody = parseTeacherRequest(req.body);
      const validation = validateTeacher(parsedBody);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const newId = await TeacherModel.generateNextId();
      const newTeacher = await TeacherModel.create({
        id: newId,
        ...parsedBody
      });

      return sendSuccess(res, formatTeacherResponse(newTeacher), 'Teacher created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create teacher', error.message);
    }
  }

  async updateTeacher(req, res) {
    try {
      const parsedBody = parseTeacherRequest(req.body);
      const validation = validateTeacher(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedTeacher = await TeacherModel.update(parseInt(req.params.id), parsedBody);
      if (!updatedTeacher) return sendError(res, 'Teacher not found', [], 404);

      return sendSuccess(res, formatTeacherResponse(updatedTeacher), 'Teacher updated successfully');
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
