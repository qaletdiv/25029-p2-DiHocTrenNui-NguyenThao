const BaseModel = require('./BaseModel');
const { Image } = require('./schemas');

/**
 * Resolves list of student IDs authorized for the user session.
 * Returns null if user is admin or undefined/null (for compatibility in CLI test scripts).
 */
async function getAuthorizedStudentIds(user) {
  if (!user) return null;
  if (user.role_id === 1) return null; // Admin has unrestricted access

  let studentIds = [];
  if (user.role_id === 2) { // VOLUNTEER
    const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
    const res = await getVolunteerLinkedResources(user.id);
    studentIds = res.studentIds || [];
  } else if (user.role_id === 3) { // TEACHER
    const { getTeacherLinkedResources } = require('../utils/teacherAuth');
    const res = await getTeacherLinkedResources(user.id);
    studentIds = res.studentIds || [];
  } else if (user.role_id === 4) { // SPONSOR
    const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
    const res = await getSponsorLinkedResources(user.id);
    studentIds = res.studentIds || [];
  }
  return studentIds;
}

class ImageModel extends BaseModel {
  constructor() {
    super('images', 'id', ['id', 'student_id', 'event_id', 'timestamp', 'url', 'metadata'], Image);
  }

  /**
   * Helper to check if a student ID is authorized for a user
   */
  async isStudentAuthorized(studentId, user) {
    const allowedIds = await getAuthorizedStudentIds(user);
    if (allowedIds === null) return true;
    return allowedIds.includes(studentId);
  }

  /**
   * Helper to check if a single image record is authorized
   */
  async isImageAuthorized(image, user) {
    if (!image) return false;
    const allowedIds = await getAuthorizedStudentIds(user);
    if (allowedIds === null) return true;
    return allowedIds.includes(image.student_id);
  }

  /**
   * Helper to filter list of images based on authorized student IDs
   */
  async filterImagesByUser(images, user) {
    const allowedIds = await getAuthorizedStudentIds(user);
    if (allowedIds === null) return images;
    return images.filter(img => allowedIds.includes(img.student_id));
  }

  /**
   * Find all images, filtered by user authorization if applicable.
   */
  async findAll(user) {
    const allowedIds = await getAuthorizedStudentIds(user);
    if (allowedIds === null) {
      return this.model.findAll({
        order: [['timestamp', 'DESC']],
        raw: true,
      });
    }

    if (allowedIds.length === 0) {
      return [];
    }

    return this.model.findAll({
      where: { student_id: { [this.Op.in]: allowedIds } },
      order: [['timestamp', 'DESC']],
      raw: true,
    });
  }

  /**
   * Find image by primary key, checking user authorization.
   */
  async findById(id, user) {
    const image = await super.findById(id);
    if (!image) return null;
    const authorized = await this.isImageAuthorized(image, user);
    if (!authorized) return null;
    return image;
  }

  /**
   * Find one image by query, checking user authorization.
   */
  async findOne(query, user) {
    const image = await super.findOne(query);
    if (!image) return null;
    if (user) {
      const authorized = await this.isImageAuthorized(image, user);
      if (!authorized) return null;
    }
    return image;
  }

  /**
   * Find images by student ID, checking user authorization.
   */
  async findByStudentId(studentId, user) {
    const isAuth = await this.isStudentAuthorized(studentId, user);
    if (!isAuth) return [];

    return this.model.findAll({
      where: { student_id: studentId },
      order: [['timestamp', 'DESC']],
      raw: true,
    });
  }

  /**
   * Find images by event ID, filtered by user authorization.
   */
  async findByEvent(eventId, user) {
    const allowedIds = await getAuthorizedStudentIds(user);
    if (allowedIds === null) {
      return this.model.findAll({
        where: { event_id: eventId },
        order: [['timestamp', 'DESC']],
        raw: true,
      });
    }

    if (allowedIds.length === 0) {
      return [];
    }

    return this.model.findAll({
      where: {
        event_id: eventId,
        student_id: { [this.Op.in]: allowedIds },
      },
      order: [['timestamp', 'DESC']],
      raw: true,
    });
  }

  /**
   * Find images within a timestamp range, filtered by user authorization.
   */
  async findByTimeRange(startDate, endDate, user) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const allowedIds = await getAuthorizedStudentIds(user);

    const where = {
      timestamp: {
        [this.Op.gte]: start,
        [this.Op.lte]: end,
      },
    };

    if (allowedIds !== null) {
      if (allowedIds.length === 0) {
        return [];
      }
      where.student_id = { [this.Op.in]: allowedIds };
    }

    return this.model.findAll({
      where,
      order: [['timestamp', 'ASC']],
      raw: true,
    });
  }
}

const instance = new ImageModel();
instance.Model = Image;
module.exports = instance;
