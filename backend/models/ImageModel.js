const BaseModel = require('./BaseModel');
const imagesData = require('../data/images');
const ImageManager = require('../utils/imageManager');

/**
 * Resolves list of student IDs authorized for the user session.
 * Returns null if user is admin or undefined/null (for compatibility in CLI test scripts).
 */
function getAuthorizedStudentIds(user) {
  if (!user) return null;
  if (user.role_id === 1) return null; // Admin has unrestricted access

  let studentIds = [];
  if (user.role_id === 2) { // VOLUNTEER
    const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
    studentIds = getVolunteerLinkedResources(user.id).studentIds || [];
  } else if (user.role_id === 3) { // TEACHER
    const { getTeacherLinkedResources } = require('../utils/teacherAuth');
    studentIds = getTeacherLinkedResources(user.id).studentIds || [];
  } else if (user.role_id === 4) { // SPONSOR
    const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
    studentIds = getSponsorLinkedResources(user.id).studentIds || [];
  }
  return studentIds;
}

class ImageModel extends BaseModel {
  constructor() {
    super(imagesData);
  }

  /**
   * Helper to filter list of images based on authorized student IDs
   */
  filterImagesByUser(images, user) {
    const allowedIds = getAuthorizedStudentIds(user);
    if (allowedIds === null) return images;
    return images.filter(img => allowedIds.includes(img.student_id));
  }

  /**
   * Helper to check if a single image is authorized
   */
  isImageAuthorized(image, user) {
    if (!image) return false;
    const allowedIds = getAuthorizedStudentIds(user);
    if (allowedIds === null) return true;
    return allowedIds.includes(image.student_id);
  }

  /**
   * Helper to check if a student ID is authorized
   */
  isStudentAuthorized(studentId, user) {
    const allowedIds = getAuthorizedStudentIds(user);
    if (allowedIds === null) return true;
    return allowedIds.includes(studentId);
  }

  async findAll(user) {
    const images = await super.findAll();
    return this.filterImagesByUser(images, user);
  }

  async findById(id, user) {
    const image = await super.findById(id);
    if (!image) return null;
    if (!this.isImageAuthorized(image, user)) {
      return null;
    }
    return image;
  }

  async findOne(query, user) {
    const image = await super.findOne(query);
    if (!image) return null;
    if (!this.isImageAuthorized(image, user)) {
      return null;
    }
    return image;
  }

  /**
   * Optimized retrieval using the ImageManager singleton
   */
  async findByStudentId(studentId, user) {
    const allowedIds = getAuthorizedStudentIds(user);
    if (allowedIds !== null && !allowedIds.includes(studentId)) {
      return [];
    }
    return ImageManager.getByStudentId(studentId);
  }

  async findByEvent(eventId, user) {
    const images = ImageManager.getByEvent(eventId);
    return this.filterImagesByUser(images, user);
  }

  async findByTimeRange(startDate, endDate, user) {
    const images = ImageManager.getByTimeRange(startDate, endDate);
    return this.filterImagesByUser(images, user);
  }

  /**
   * Helper to generate a new image ID
   */
  async generateNextId() {
    if (this.data.length === 0) return 1;
    const latestImage = this.data.reduce((max, current) =>
      current.id > max.id ? current : max
    );
    return latestImage.id + 1;
  }

  // Override create to keep indices in sync if needed
  async create(newItem) {
    const created = await super.create(newItem);
    ImageManager.initializeIndices(); // Refresh indices
    return created;
  }

  // Override delete/update to keep indices in sync
  async update(id, updatedFields) {
    const updated = await super.update(id, updatedFields);
    if (updated) ImageManager.initializeIndices();
    return updated;
  }

  async delete(id) {
    const success = await super.delete(id);
    if (success) ImageManager.initializeIndices();
    return success;
  }
}

module.exports = new ImageModel();
