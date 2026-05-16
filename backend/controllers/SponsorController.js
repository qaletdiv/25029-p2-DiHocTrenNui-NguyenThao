const SponsorModel = require('../models/SponsorModel');
const { validateSponsor } = require('../validations/sponsorValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class SponsorController {
  async getAllSponsors(req, res) {
    try {
      const sponsors = await SponsorModel.findAll();
      return sendSuccess(res, sponsors);
    } catch (error) {
      return sendError(res, 'Failed to fetch sponsors', error.message);
    }
  }

  async getSponsorById(req, res) {
    try {
      const sponsor = await SponsorModel.findById(parseInt(req.params.id));
      if (!sponsor) return sendError(res, 'Sponsor not found', [], 404);
      return sendSuccess(res, sponsor);
    } catch (error) {
      return sendError(res, 'Failed to fetch sponsor', error.message);
    }
  }

  async createSponsor(req, res) {
    try {
      const validation = validateSponsor(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const { full_name } = req.body;
      const existingSponsor = await SponsorModel.findByFullName(full_name);
      if (existingSponsor) {
        return sendError(res, 'Sponsor name already exists', [], 400);
      }

      const newId = await SponsorModel.generateNextId();
      const newSponsor = await SponsorModel.create({
        id: newId,
        ...req.body
      });


      return sendSuccess(res, newSponsor, 'Sponsor created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create sponsor', error.message);
    }
  }

  async updateSponsor(req, res) {
    try {
      const validation = validateSponsor(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedSponsor = await SponsorModel.update(parseInt(req.params.id), req.body);
      if (!updatedSponsor) return sendError(res, 'Sponsor not found', [], 404);

      return sendSuccess(res, updatedSponsor, 'Sponsor updated successfully');
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
