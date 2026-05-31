const SponsorModel = require('../models/SponsorModel');
const { validateSponsor } = require('../validations/sponsorValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const { formatSponsorResponse, parseSponsorRequest } = require('../utils/formatSponsor');

class SponsorController {
  async getAllSponsors(req, res) {
    try {
      const sponsors = await SponsorModel.findAll();
      let formattedSponsors = sponsors.map(formatSponsorResponse);

      // Search filter (by full_name, id, or phone)
      const searchQuery = req.query.search ? req.query.search.toLowerCase().trim() : '';
      if (searchQuery) {
        formattedSponsors = formattedSponsors.filter(s => {
          const nameMatch = s.full_name && s.full_name.toLowerCase().includes(searchQuery);
          const idMatch = String(s.id).toLowerCase().includes(searchQuery);
          const phoneMatch = s.phone && s.phone.toLowerCase().includes(searchQuery);
          return nameMatch || idMatch || phoneMatch;
        });
      }

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { sponsorId } = getSponsorLinkedResources(req.user.id);
        formattedSponsors = formattedSponsors.filter(s => s.id === sponsorId);
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { sponsorIds } = getTeacherLinkedResources(req.user.id);
        formattedSponsors = formattedSponsors.filter(s => sponsorIds.includes(s.id));
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { sponsorIds } = getVolunteerLinkedResources(req.user.id);
        formattedSponsors = formattedSponsors.filter(s => sponsorIds.includes(s.id));
      }

      console.log("getAllSponsors: ", formattedSponsors);
      return sendSuccess(res, paginate(formattedSponsors, req, 'sponsors'));
    } catch (error) {
      return sendError(res, 'Failed to fetch sponsors', error.message);
    }
  }

  async getSponsorById(req, res) {
    try {
      const sponsor = await SponsorModel.findById(parseInt(req.params.id));
      if (!sponsor) return sendError(res, 'Sponsor not found', [], 404);

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { sponsorId } = getSponsorLinkedResources(req.user.id);
        if (sponsorId !== sponsor.id) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { sponsorIds } = getTeacherLinkedResources(req.user.id);
        if (!sponsorIds.includes(sponsor.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { sponsorIds } = getVolunteerLinkedResources(req.user.id);
        if (!sponsorIds.includes(sponsor.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      console.log("getSponsorById: ", formatSponsorResponse(sponsor));
      return sendSuccess(res, formatSponsorResponse(sponsor));
    } catch (error) {
      return sendError(res, 'Failed to fetch sponsor', error.message);
    }
  }

  async createSponsor(req, res) {
    try {
      const parsedBody = parseSponsorRequest(req.body);
      const validation = validateSponsor(parsedBody);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const { full_name } = parsedBody;
      const existingSponsor = await SponsorModel.findByFullName(full_name);
      if (existingSponsor) {
        return sendError(res, 'Sponsor name already exists', [], 400);
      }

      const newId = await SponsorModel.generateNextId();
      const newSponsor = await SponsorModel.create({
        id: newId,
        ...parsedBody
      });

      return sendSuccess(res, formatSponsorResponse(newSponsor), 'Sponsor created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create sponsor', error.message);
    }
  }

  async updateSponsor(req, res) {
    try {
      const parsedBody = parseSponsorRequest(req.body);
      const validation = validateSponsor(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedSponsor = await SponsorModel.update(parseInt(req.params.id), parsedBody);
      if (!updatedSponsor) return sendError(res, 'Sponsor not found', [], 404);

      return sendSuccess(res, formatSponsorResponse(updatedSponsor), 'Sponsor updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update sponsor', error.message);
    }
  }

  async deleteSponsor(req, res) {
    try {
      const success = await SponsorModel.delete(parseInt(req.params.id));
      if (!success) return sendError(res, 'Sponsor not found', [], 404);

      return sendSuccess(res, null, 'Sponsor deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete sponsor', error.message);
    }
  }
}

module.exports = new SponsorController();
