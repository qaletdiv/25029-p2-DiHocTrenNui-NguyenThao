const BaseModel = require('./BaseModel');
const imagesData = require('../data/images');
const ImageManager = require('../utils/imageManager');

class ImageModel extends BaseModel {
  constructor() {
    super(imagesData);
  }

  /**
   * Optimized retrieval using the ImageManager singleton
   */
  async findByStudentId(studentId) {
    return ImageManager.getByStudentId(studentId);
  }

  async findByEvent(eventId) {
    return ImageManager.getByEvent(eventId);
  }

  async findByTimeRange(startDate, endDate) {
    return ImageManager.getByTimeRange(startDate, endDate);
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
