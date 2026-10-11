const VolunteerModel = require('../models/VolunteerModel');
const { validateVolunteer } = require('../validations/volunteerValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const { formatVolunteerResponse, parseVolunteerRequest } = require('../utils/formatVolunteer');
const lookupService = require('../utils/lookupService');

class VolunteerController {
  async getAllVolunteers(req, res) {
    try {
      await lookupService.ensureLoaded();
      const volunteers = await VolunteerModel.findAll();
      let formattedVolunteers = volunteers.map(formatVolunteerResponse);

      // Search filter (by full_name, id, or phone)
      const searchQuery = req.query.search ? req.query.search.toLowerCase().trim() : '';
      if (searchQuery) {
        formattedVolunteers = formattedVolunteers.filter(v => {
          const nameMatch = v.full_name && v.full_name.toLowerCase().includes(searchQuery);
          const idMatch = String(v.id).toLowerCase().includes(searchQuery);
          const phoneMatch = v.phone && v.phone.toLowerCase().includes(searchQuery);
          return nameMatch || idMatch || phoneMatch;
        });
      }

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { volunteerIds } = await getSponsorLinkedResources(req.user.id);
        formattedVolunteers = formattedVolunteers.filter(v => volunteerIds.includes(v.id));
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { volunteerIds } = await getTeacherLinkedResources(req.user.id);
        formattedVolunteers = formattedVolunteers.filter(v => volunteerIds.includes(v.id));
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { volunteerId } = await getVolunteerLinkedResources(req.user.id);
        formattedVolunteers = formattedVolunteers.filter(v => v.id === volunteerId);
      }

      return sendSuccess(res, paginate(formattedVolunteers, req, 'volunteers'));
    } catch (error) {
      return sendError(res, 'Failed to fetch volunteers', error.message);
    }
  }

  async getVolunteerById(req, res) {
    try {
      await lookupService.ensureLoaded();
      const volunteer = await VolunteerModel.findById(parseInt(req.params.id, 10));
      if (!volunteer) return sendError(res, 'Volunteer not found', [], 404);

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { volunteerIds } = await getSponsorLinkedResources(req.user.id);
        if (!volunteerIds.includes(volunteer.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { volunteerIds } = await getTeacherLinkedResources(req.user.id);
        if (!volunteerIds.includes(volunteer.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { volunteerId } = await getVolunteerLinkedResources(req.user.id);
        if (volunteer.id !== volunteerId) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      return sendSuccess(res, formatVolunteerResponse(volunteer));
    } catch (error) {
      return sendError(res, 'Failed to fetch volunteer', error.message);
    }
  }

  async createVolunteer(req, res) {
    try {
      await lookupService.ensureLoaded();
      const parsedBody = parseVolunteerRequest(req.body);
      const validation = validateVolunteer(parsedBody);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const newId = await VolunteerModel.generateNextId();
      const newVolunteer = await VolunteerModel.create({
        id: newId,
        ...parsedBody,
        created_at: new Date(),
        updated_at: new Date(),
      });

      lookupService.invalidateCache();
      return sendSuccess(res, formatVolunteerResponse(newVolunteer), 'Volunteer created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create volunteer', error.message);
    }
  }

  async updateVolunteer(req, res) {
    try {
      await lookupService.ensureLoaded();
      const parsedBody = parseVolunteerRequest(req.body);
      const validation = validateVolunteer(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      parsedBody.updated_at = new Date();
      const updatedVolunteer = await VolunteerModel.update(parseInt(req.params.id, 10), parsedBody);
      if (!updatedVolunteer) return sendError(res, 'Volunteer not found', [], 404);

      lookupService.invalidateCache();
      return sendSuccess(res, formatVolunteerResponse(updatedVolunteer), 'Volunteer updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update volunteer', error.message);
    }
  }

  async deleteVolunteer(req, res) {
    try {
      const success = await VolunteerModel.delete(parseInt(req.params.id, 10));
      if (!success) return sendError(res, 'Volunteer not found', [], 404);

      lookupService.invalidateCache();
      return sendSuccess(res, null, 'Volunteer deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete volunteer', error.message);
    }
  }
}

module.exports = new VolunteerController();
