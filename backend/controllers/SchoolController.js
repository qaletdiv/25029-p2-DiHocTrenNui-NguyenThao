const SchoolModel = require('../models/SchoolModel');
const { validateSchool } = require('../validations/schoolValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const { formatSchoolResponse, parseSchoolRequest } = require('../utils/formatSchool');
const lookupService = require('../utils/lookupService');

class SchoolController {
  async getAllSchools(req, res) {
    try {
      await lookupService.ensureLoaded();
      const schools = await SchoolModel.findAll();
      let formattedSchools = schools.map(formatSchoolResponse);

      // Search filter (by name, id, or address)
      const searchQuery = req.query.search ? req.query.search.toLowerCase().trim() : '';
      if (searchQuery) {
        formattedSchools = formattedSchools.filter(s => {
          const nameMatch = s.name && s.name.toLowerCase().includes(searchQuery);
          const idMatch = String(s.id).toLowerCase().includes(searchQuery);
          const addrMatch = s.address && s.address.toLowerCase().includes(searchQuery);
          return nameMatch || idMatch || addrMatch;
        });
      }

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { schoolIds } = await getSponsorLinkedResources(req.user.id);
        formattedSchools = formattedSchools.filter(school => schoolIds.includes(school.id));
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { schoolIds } = await getTeacherLinkedResources(req.user.id);
        formattedSchools = formattedSchools.filter(school => schoolIds.includes(school.id));
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { schoolIds } = await getVolunteerLinkedResources(req.user.id);
        formattedSchools = formattedSchools.filter(school => schoolIds.includes(school.id));
      }

      return sendSuccess(res, paginate(formattedSchools, req, 'schools'));
    } catch (error) {
      return sendError(res, 'Failed to fetch schools', error.message);
    }
  }

  async getSchoolById(req, res) {
    try {
      await lookupService.ensureLoaded();
      const school = await SchoolModel.findById(parseInt(req.params.id, 10));
      if (!school) return sendError(res, 'School not found', [], 404);

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { schoolIds } = await getSponsorLinkedResources(req.user.id);
        if (!schoolIds.includes(school.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { schoolIds } = await getTeacherLinkedResources(req.user.id);
        if (!schoolIds.includes(school.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { schoolIds } = await getVolunteerLinkedResources(req.user.id);
        if (!schoolIds.includes(school.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      return sendSuccess(res, formatSchoolResponse(school));
    } catch (error) {
      return sendError(res, 'Failed to fetch school', error.message);
    }
  }

  async createSchool(req, res) {
    try {
      await lookupService.ensureLoaded();
      const parsedBody = parseSchoolRequest(req.body);
      const validation = validateSchool(parsedBody);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const { name } = parsedBody;
      const existingSchool = await SchoolModel.findByName(name);
      if (existingSchool) {
        return sendError(res, 'School name already exists', [], 400);
      }

      const newId = await SchoolModel.generateNextId();
      const newSchool = await SchoolModel.create({
        id: newId,
        ...parsedBody,
        created_at: new Date(),
        updated_at: new Date(),
      });

      lookupService.invalidateCache();
      return sendSuccess(res, formatSchoolResponse(newSchool), 'School created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create school', error.message);
    }
  }

  async updateSchool(req, res) {
    try {
      await lookupService.ensureLoaded();
      const parsedBody = parseSchoolRequest(req.body);
      const validation = validateSchool(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      parsedBody.updated_at = new Date();
      const updatedSchool = await SchoolModel.update(parseInt(req.params.id, 10), parsedBody);
      if (!updatedSchool) return sendError(res, 'School not found', [], 404);

      lookupService.invalidateCache();
      return sendSuccess(res, formatSchoolResponse(updatedSchool), 'School updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update school', error.message);
    }
  }

  async deleteSchool(req, res) {
    try {
      const success = await SchoolModel.delete(parseInt(req.params.id, 10));
      if (!success) return sendError(res, 'School not found', [], 404);

      lookupService.invalidateCache();
      return sendSuccess(res, null, 'School deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete school', error.message);
    }
  }
}

module.exports = new SchoolController();
