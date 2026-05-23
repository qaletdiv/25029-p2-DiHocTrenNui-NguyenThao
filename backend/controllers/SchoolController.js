const SchoolModel = require('../models/SchoolModel');
const { validateSchool } = require('../validations/schoolValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const { formatSchoolResponse, parseSchoolRequest } = require('../utils/formatSchool');

class SchoolController {
  async getAllSchools(req, res) {
    try {
      const schools = await SchoolModel.findAll();
      const formattedSchools = schools.map(formatSchoolResponse);
      console.log("getAllSchools: \n", formattedSchools);
      return sendSuccess(res, paginate(formattedSchools, req, 'schools'));
    } catch (error) {
      return sendError(res, 'Failed to fetch schools', error.message);
    }
  }

  async getSchoolById(req, res) {
    try {
      const school = await SchoolModel.findById(parseInt(req.params.id));
      if (!school) return sendError(res, 'School not found', [], 404);
      console.log("getSchoolById: \n", "Id: \n", req.params.id, "\n School: \n", formatSchoolResponse(school));
      return sendSuccess(res, formatSchoolResponse(school));
    } catch (error) {
      return sendError(res, 'Failed to fetch school', error.message);
    }
  }


  async createSchool(req, res) {
    try {
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
        ...parsedBody
      });


      return sendSuccess(res, formatSchoolResponse(newSchool), 'School created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create school', error.message);
    }
  }

  async updateSchool(req, res) {
    try {
      const parsedBody = parseSchoolRequest(req.body);
      const validation = validateSchool(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedSchool = await SchoolModel.update(parseInt(req.params.id), parsedBody);
      if (!updatedSchool) return sendError(res, 'School not found', [], 404);

      return sendSuccess(res, formatSchoolResponse(updatedSchool), 'School updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update school', error.message);
    }
  }

  async deleteSchool(req, res) {
    try {
      const success = await SchoolModel.delete(parseInt(req.params.id));
      if (!success) return sendError(res, 'School not found', [], 404);
      
      return sendSuccess(res, null, 'School deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete school', error.message);
    }
  }

}

module.exports = new SchoolController();
