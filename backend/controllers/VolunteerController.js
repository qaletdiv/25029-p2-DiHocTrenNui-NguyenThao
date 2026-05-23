const VolunteerModel = require('../models/VolunteerModel');
const { validateVolunteer } = require('../validations/volunteerValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const { formatVolunteerResponse, parseVolunteerRequest } = require('../utils/formatVolunteer');

class VolunteerController {
  async getAllVolunteers(req, res) {
    try {
      const volunteers = await VolunteerModel.findAll();
      const formattedVolunteers = volunteers.map(formatVolunteerResponse);
      console.log("getAllVolunteers: \n", formattedVolunteers);
      return sendSuccess(res, paginate(formattedVolunteers, req, 'volunteers'));
    } catch (error) {
      return sendError(res, 'Failed to fetch volunteers', error.message);
    }
  }

  async getVolunteerById(req, res) {
    try {
      const volunteer = await VolunteerModel.findById(parseInt(req.params.id));
      if (!volunteer) return sendError(res, 'Volunteer not found', [], 404);
      console.log("getVolunteerById: \n", "Id: \n", req.params.id, "\n Volunteer: \n", formatVolunteerResponse(volunteer));
      return sendSuccess(res, formatVolunteerResponse(volunteer));
    } catch (error) {
      return sendError(res, 'Failed to fetch volunteer', error.message);
    }
  }

  async createVolunteer(req, res) {
    try {
      const parsedBody = parseVolunteerRequest(req.body);
      const validation = validateVolunteer(parsedBody);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const newId = await VolunteerModel.generateNextId();
      const newVolunteer = await VolunteerModel.create({
        id: newId,
        ...parsedBody
      });

      return sendSuccess(res, formatVolunteerResponse(newVolunteer), 'Volunteer created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create volunteer', error.message);
    }
  }

  async updateVolunteer(req, res) {
    try {
      const parsedBody = parseVolunteerRequest(req.body);
      const validation = validateVolunteer(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedVolunteer = await VolunteerModel.update(parseInt(req.params.id), parsedBody);
      if (!updatedVolunteer) return sendError(res, 'Volunteer not found', [], 404);

      return sendSuccess(res, formatVolunteerResponse(updatedVolunteer), 'Volunteer updated successfully');
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
