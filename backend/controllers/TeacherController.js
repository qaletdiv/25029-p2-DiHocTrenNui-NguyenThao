const TeacherModel = require('../models/TeacherModel');
const { validateTeacher } = require('../validations/teacherValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const { formatTeacherResponse, parseTeacherRequest } = require('../utils/formatTeacher');
const lookupService = require('../utils/lookupService');

class TeacherController {
  async getAllTeachers(req, res) {
    try {
      await lookupService.ensureLoaded();
      const teachers = await TeacherModel.findAll();
      let formattedTeachers = teachers.map(formatTeacherResponse);

      // Search filter (by full_name, id, or phone)
      const searchQuery = req.query.search ? req.query.search.toLowerCase().trim() : '';
      if (searchQuery) {
        formattedTeachers = formattedTeachers.filter(t => {
          const nameMatch = t.full_name && t.full_name.toLowerCase().includes(searchQuery);
          const idMatch = String(t.id).toLowerCase().includes(searchQuery);
          const phoneMatch = t.phone && t.phone.toLowerCase().includes(searchQuery);
          return nameMatch || idMatch || phoneMatch;
        });
      }

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { teacherIds } = await getSponsorLinkedResources(req.user.id);
        formattedTeachers = formattedTeachers.filter(t => teacherIds.includes(t.id));
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { teacherId } = await getTeacherLinkedResources(req.user.id);
        formattedTeachers = formattedTeachers.filter(t => t.id === teacherId);
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { teacherIds } = await getVolunteerLinkedResources(req.user.id);
        formattedTeachers = formattedTeachers.filter(t => teacherIds.includes(t.id));
      }

      return sendSuccess(res, paginate(formattedTeachers, req, 'teachers'));
    } catch (error) {
      return sendError(res, 'Failed to fetch teachers', error.message);
    }
  }

  async getTeacherById(req, res) {
    try {
      await lookupService.ensureLoaded();
      const teacher = await TeacherModel.findById(parseInt(req.params.id, 10));
      if (!teacher) return sendError(res, 'Teacher not found', [], 404);

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { teacherIds } = await getSponsorLinkedResources(req.user.id);
        if (!teacherIds.includes(teacher.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { teacherId } = await getTeacherLinkedResources(req.user.id);
        if (teacher.id !== teacherId) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { teacherIds } = await getVolunteerLinkedResources(req.user.id);
        if (!teacherIds.includes(teacher.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      return sendSuccess(res, formatTeacherResponse(teacher));
    } catch (error) {
      return sendError(res, 'Failed to fetch teacher', error.message);
    }
  }

  async createTeacher(req, res) {
    try {
      await lookupService.ensureLoaded();
      const parsedBody = parseTeacherRequest(req.body);
      const validation = validateTeacher(parsedBody);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const newId = await TeacherModel.generateNextId();
      const newTeacher = await TeacherModel.create({
        id: newId,
        ...parsedBody,
        created_at: new Date(),
        updated_at: new Date(),
      });

      lookupService.invalidateCache();
      return sendSuccess(res, formatTeacherResponse(newTeacher), 'Teacher created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create teacher', error.message);
    }
  }

  async updateTeacher(req, res) {
    try {
      await lookupService.ensureLoaded();
      const parsedBody = parseTeacherRequest(req.body);
      const validation = validateTeacher(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      parsedBody.updated_at = new Date();
      const updatedTeacher = await TeacherModel.update(parseInt(req.params.id, 10), parsedBody);
      if (!updatedTeacher) return sendError(res, 'Teacher not found', [], 404);

      lookupService.invalidateCache();
      return sendSuccess(res, formatTeacherResponse(updatedTeacher), 'Teacher updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update teacher', error.message);
    }
  }

  async deleteTeacher(req, res) {
    try {
      const success = await TeacherModel.delete(parseInt(req.params.id, 10));
      if (!success) return sendError(res, 'Teacher not found', [], 404);

      lookupService.invalidateCache();
      return sendSuccess(res, null, 'Teacher deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete teacher', error.message);
    }
  }
}

module.exports = new TeacherController();
