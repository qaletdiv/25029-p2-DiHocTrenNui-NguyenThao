const imagesData = require('../data/images');

/**
 * ImageManager - A utility for efficient image data retrieval.
 * Uses indexing to achieve O(1) lookups for IDs and Student IDs,
 * and O(log n) for time range queries.
 */
class ImageManager {
  constructor(data) {
    this.data = data;
    this.imagesById = new Map();
    this.imagesByStudent = new Map();
    this.imagesByEvent = new Map();
    this.imagesSortedByTime = [];

    this.initializeIndices();
  }

  /**
   * Builds indices for quick lookup
   */
  initializeIndices() {
    this.imagesById.clear();
    this.imagesByStudent.clear();
    this.imagesByEvent.clear();

    this.imagesSortedByTime = [...this.data].sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    this.data.forEach(image => {
      // Index by ID
      this.imagesById.set(image.id, image);

      // Index by Student ID
      if (!this.imagesByStudent.has(image.student_id)) {
        this.imagesByStudent.set(image.student_id, []);
      }
      this.imagesByStudent.get(image.student_id).push(image);

      // Index by Event ID
      if (!this.imagesByEvent.has(image.event_id)) {
        this.imagesByEvent.set(image.event_id, []);
      }
      this.imagesByEvent.get(image.event_id).push(image);
    });
  }

  /**
   * O(1) lookup by ID
   */
  getById(id) {
    return this.imagesById.get(id) || null;
  }

  /**
   * O(1) lookup by Student ID
   */
  getByStudentId(studentId) {
    return this.imagesByStudent.get(studentId) || [];
  }

  /**
   * O(1) lookup by Event ID
   */
  getByEvent(eventId) {
    return this.imagesByEvent.get(eventId) || [];
  }

  /**
   * O(log n) lookup for time range
   * @param {string} startDate - ISO 8601 string
   * @param {string} endDate - ISO 8601 string
   */
  getByTimeRange(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // Binary search for the first element >= start
    let left = 0;
    let right = this.imagesSortedByTime.length - 1;
    let startIndex = this.imagesSortedByTime.length;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (new Date(this.imagesSortedByTime[mid].timestamp).getTime() >= start) {
        startIndex = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Filter from startIndex until we exceed endDate
    const results = [];
    for (let i = startIndex; i < this.imagesSortedByTime.length; i++) {
      if (new Date(this.imagesSortedByTime[i].timestamp).getTime() <= end) {
        results.push(this.imagesSortedByTime[i]);
      } else {
        break; // Optimization: since it's sorted, we can stop early
      }
    }

    return results;
  }

  /**
   * Database Migration Helper: 
   * Returns data in a format suitable for batch insertion into SQL/NoSQL
   */
  getNormalizedData() {
    return this.data.map(img => ({
      ...img,
      metadata: JSON.stringify(img.metadata) // SQL friendly
    }));
  }
}

// Singleton instance
module.exports = new ImageManager(imagesData);
