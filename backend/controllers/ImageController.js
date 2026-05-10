const ImageModel = require('../models/ImageModel');
const { validateImage } = require('../validations/imageValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class ImageController {
  async getAllImages(req, res) {
    try {
      const images = await ImageModel.findAll();
      return sendSuccess(res, images);
    } catch (error) {
      return sendError(res, 'Failed to fetch images', error.message);
    }
  }

  async getImageById(req, res) {
    try {
      const image = await ImageModel.findById(parseInt(req.params.id));
      if (!image) return sendError(res, 'Image not found', [], 404);
      return sendSuccess(res, image);
    } catch (error) {
      return sendError(res, 'Failed to fetch image', error.message);
    }
  }

  async getImagesByStudent(req, res) {
    try {
      const images = await ImageModel.findByStudentId(req.params.studentId);
      return sendSuccess(res, images);
    } catch (error) {
      return sendError(res, 'Failed to fetch student images', error.message);
    }
  }

  async getImagesByRange(req, res) {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return sendError(res, 'Start and end dates are required', [], 400);
      }
      const images = await ImageModel.findByTimeRange(start, end);
      return sendSuccess(res, images);
    } catch (error) {
      return sendError(res, 'Failed to fetch images in range', error.message);
    }
  }

  async createImage(req, res) {
    try {
      const validation = validateImage(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const newId = await ImageModel.generateNextId();
      const newImage = await ImageModel.create({
        id: newId,
        ...req.body,
        metadata: req.body.metadata || {}
      });

      return sendSuccess(res, newImage, 'Image created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create image', error.message);
    }
  }

  async updateImage(req, res) {
    try {
      const validation = validateImage(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const updatedImage = await ImageModel.update(parseInt(req.params.id), req.body);
      if (!updatedImage) return sendError(res, 'Image not found', [], 404);

      return sendSuccess(res, updatedImage, 'Image updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update image', error.message);
    }
  }

  async deleteImage(req, res) {
    try {
      const success = await ImageModel.delete(parseInt(req.params.id));
      if (!success) return sendError(res, 'Image not found', [], 404);
      
      return sendSuccess(res, null, 'Image deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete image', error.message);
    }
  }
}

module.exports = new ImageController();
