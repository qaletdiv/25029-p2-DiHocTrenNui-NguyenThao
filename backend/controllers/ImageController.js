const ImageModel = require('../models/ImageModel');
const { validateImage } = require('../validations/imageValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');
const path = require('path');
const fs = require('fs');

/**
 * Helper function to format the image response.
 * Dynamically resolves relative image URLs to go through the authenticated image proxy.
 */
function formatImageResponse(image, req) {
  if (!image || !image.url) return image;

  // Defensive checks for req to support mock/test environments
  const headers = req && req.headers ? req.headers : {};
  const query = req && req.query ? req.query : {};

  const authHeader = headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  if (!token && query.token) {
    token = query.token;
  }
  const tokenParam = token ? `?token=${token}` : '';

  // Check if it's already an absolute HTTP/HTTPS URL
  if (image.url.startsWith('http://') || image.url.startsWith('https://')) {
    return image;
  }

  // Extract base filename from path
  let filename = image.url;
  if (filename.includes('/')) {
    filename = filename.split('/').pop();
  }

  let baseUrl = '';
  if (req && typeof req.protocol === 'string' && typeof req.get === 'function') {
    baseUrl = `${req.protocol}://${req.get('host')}`;
  } else {
    // Fallback if req is not a standard Express Request (e.g. CLI test scripts)
    baseUrl = 'http://localhost:5001';
  }

  const proxyUrl = `${baseUrl}/images/proxy/${filename}${tokenParam}`;

  return {
    ...image,
    url: proxyUrl
  };
}

/**
 * Sanitizes input URLs to store only raw filenames in the database,
 * preventing ephemeral proxy/token strings from being saved.
 */
/**
 * Sanitizes input URLs to store only raw filenames in the database,
 * preventing ephemeral proxy/token strings from being saved.
 */
function sanitizeInputUrl(url) {
  if (typeof url === 'string' && url.includes('/images/proxy/')) {
    const filename = url.split('/images/proxy/')[1].split('?')[0];
    return filename;
  }
  return url;
}

/**
 * Decodes base64 file data and writes it synchronously to the public upload directory.
 */
function saveUploadedFile(filename, fileData) {
  if (!filename || !fileData) return;

  // Extract base64 content safely without regex backtracking on large strings
  const commaIdx = fileData.indexOf(';base64,');
  if (commaIdx === -1) {
    throw new Error('Invalid base64 image data format');
  }

  const base64Content = fileData.substring(commaIdx + 8);
  const buffer = Buffer.from(base64Content, 'base64');
  const uploadDir = path.join(__dirname, '../public/upload/event');

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const destPath = path.join(uploadDir, path.basename(filename));
  fs.writeFileSync(destPath, buffer);
}

class ImageController {
  async getAllImages(req, res) {
    try {
      let images = await ImageModel.findAll(req.user);

      // Search filter (by student_id or event_id)
      const searchQuery = req.query.search ? req.query.search.toLowerCase().trim() : '';
      if (searchQuery) {
        images = images.filter(img => {
          const studentIdMatch = String(img.student_id).toLowerCase().includes(searchQuery);
          const eventIdMatch = img.event_id && String(img.event_id).toLowerCase().includes(searchQuery);
          const monthMatch = img.metadata && img.metadata.month && String(img.metadata.month).toLowerCase().includes(searchQuery);
          return studentIdMatch || eventIdMatch || monthMatch;
        });
      }

      const paginated = paginate(images, req, 'images');
      paginated.images = paginated.images.map(img => formatImageResponse(img, req));
      return sendSuccess(res, paginated);
    } catch (error) {
      return sendError(res, 'Failed to fetch images', error.message);
    }
  }

  async getImageById(req, res) {
    try {
      const imageId = parseInt(req.params.id);
      // First check if the image exists in the database
      const rawImage = await ImageModel.findOne({ id: imageId });
      if (!rawImage) {
        return sendError(res, 'Image not found', [], 404);
      }

      // Check access permission
      const image = await ImageModel.findById(imageId, req.user);
      if (!image) {
        return sendError(res, 'Access Denied: You are not authorized to view this image', [], 403);
      }

      return sendSuccess(res, formatImageResponse(image, req));
    } catch (error) {
      return sendError(res, 'Failed to fetch image', error.message);
    }
  }

  async getImagesByStudent(req, res) {
    try {
      const studentId = req.params.studentId;
      // If user is not authorized to view this student's data, return a 403 Forbidden error
      if (req.user && !ImageModel.isStudentAuthorized(studentId, req.user)) {
        return sendError(res, 'Access Denied: You are not authorized to view this student\'s images', [], 403);
      }

      const images = await ImageModel.findByStudentId(studentId, req.user);
      const formatted = images.map(img => formatImageResponse(img, req));
      return sendSuccess(res, formatted);
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
      const images = await ImageModel.findByTimeRange(start, end, req.user);
      const formatted = images.map(img => formatImageResponse(img, req));
      return sendSuccess(res, formatted);
    } catch (error) {
      return sendError(res, 'Failed to fetch images in range', error.message);
    }
  }

  async createImage(req, res) {
    try {
      let fileData = null;
      if (req.body && req.body.fileData) {
        fileData = req.body.fileData;
        delete req.body.fileData;
      }

      if (req.body && req.body.url) {
        req.body.url = sanitizeInputUrl(req.body.url);
      }
      const validation = validateImage(req.body);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      if (fileData) {
        saveUploadedFile(req.body.url, fileData);
      }

      const newId = await ImageModel.generateNextId();
      const newImage = await ImageModel.create({
        id: newId,
        ...req.body,
        metadata: req.body.metadata || {}
      });

      return sendSuccess(res, formatImageResponse(newImage, req), 'Image created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create image', error.message);
    }
  }

  async updateImage(req, res) {
    try {
      let fileData = null;
      if (req.body && req.body.fileData) {
        fileData = req.body.fileData;
        delete req.body.fileData;
      }

      if (req.body && req.body.url) {
        req.body.url = sanitizeInputUrl(req.body.url);
      }
      const validation = validateImage(req.body, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      if (fileData) {
        saveUploadedFile(req.body.url, fileData);
      }

      const updatedImage = await ImageModel.update(parseInt(req.params.id), req.body);
      if (!updatedImage) return sendError(res, 'Image not found', [], 404);

      return sendSuccess(res, formatImageResponse(updatedImage, req), 'Image updated successfully');
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

  async proxyImage(req, res) {
    try {
      const filename = path.basename(req.params.filename);
      const filePath = path.join(__dirname, '../public/upload/event', filename);
      const fallbackPath = path.join(__dirname, '../public/placeholder.jpg');

      // Check access permission at the repository/model layer
      const image = await ImageModel.findOne({ url: filename }, req.user);
      if (!image) {
        // Find if the image exists at all to determine if it is unauthorized (403) or just not found (404)
        const rawImage = await ImageModel.findOne({ url: filename });
        if (rawImage) {
          return res.status(403).send('Forbidden: Access Denied');
        }
      }

      const options = {
        maxAge: '1d', // Cache for 1 day
        immutable: true,
        lastModified: true,
        etag: true
      };

      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath, options);
      } else {
        // Fallback to placeholder if file does not exist
        if (fs.existsSync(fallbackPath)) {
          return res.sendFile(fallbackPath, { maxAge: '1h', lastModified: true, etag: true });
        } else {
          return res.status(404).send('Image not found');
        }
      }
    } catch (error) {
      console.error('Error in image proxy:', error);
      return res.status(500).send('Internal server error');
    }
  }
}

module.exports = new ImageController();
