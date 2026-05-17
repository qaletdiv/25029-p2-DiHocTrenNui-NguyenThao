const VolunteerModel = require('../models/VolunteerModel');
const { validateVolunteer } = require('../validations/volunteerValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');

class VolunteerController {
  async getAllVolunteers(req, res) {
    try {
      const volunteers = await VolunteerModel.findAll();
      return sendSuccess(res, paginate(volunteers, req, 'volunteers'));
    } catch (error) {
      return sendError(res, 'Failed to fetch volunteers', error.message);
    }
  }

  async getVolunteerById(req, res) {
    try {
      const volunteer = await VolunteerModel.findById(parseInt(req.params.id));
      if (!volunteer) return sendError(res, 'Volunteer not found', [], 404);
      return sendSuccess(res, volunteer);
    } catch (error) {
      return sendError(res, 'Failed to fetch volunteer', error.message);
    }
  }

  async createVolunteer(req, res) {
    try {
      const validation = validateVolunteer(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const newId = await VolunteerModel.generateNextId();
      const newVolunteer = await VolunteerModel.create({
        id: newId,
        ...req.body
      });

      return sendSuccess(res, newVolunteer, 'Volunteer created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create volunteer', error.message);
    }
  }

  async updateVolunteer(req, res) {
    try {
      const validation = validateVolunteer(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedVolunteer = await VolunteerModel.update(parseInt(req.params.id), req.body);
      if (!updatedVolunteer) return sendError(res, 'Volunteer not found', [], 404);

      return sendSuccess(res, updatedVolunteer, 'Volunteer updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update volunteer', error.message);
    }
  }

  async deleteVolunteer(req, res) {
    try {
      const success = await VolunteerModel.delete(parseInt(req.params.id));
      if (!success) return sendError(res, 'Volunteer not found', [], 404);
      
      return sendSuccess(res, null, 'Volunteer deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete volunteer', error.message);
    }
  }
}

module.exports = new VolunteerController();
