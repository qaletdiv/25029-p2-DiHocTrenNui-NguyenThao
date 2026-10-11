const lookupService = require('./lookupService');

/**
 * Transforms a raw student object by replacing relation IDs with actual string values
 * @param {Object} rawStudent
 * @param {Object} [lookups] - Optional pre-fetched lookup maps
 */
const formatStudentResponse = (rawStudent, lookups = null) => {
  if (!rawStudent) return rawStudent;

  const schoolMap = (lookups && lookups.schools) || lookupService.cache.schools;
  const statusMap = (lookups && lookups.studentStatusMap) || lookupService.cache.studentStatusMap;
  const accountMap = (lookups && lookups.accounts) || lookupService.cache.accounts;

  const {
    school_id,
    status_id,
    created_by,
    updated_by,
    ...restOfStudentData
  } = rawStudent;

  return {
    ...restOfStudentData,
    school: (schoolMap && schoolMap.get(school_id)) || rawStudent.school || null,
    status: (statusMap && statusMap.get(status_id)) || rawStudent.status || null,
    creator: (accountMap && accountMap.get(created_by)) || rawStudent.creator || null,
    updater: (accountMap && accountMap.get(updated_by)) || rawStudent.updater || null,
  };
};

/**
 * Transforms an enriched/received student object from the client back to the database-compatible format.
 * Resolves virtual text fields (school, status) to their foreign key IDs (school_id, status_id).
 */
const parseStudentRequest = (receivedStudent, lookups = null) => {
  if (!receivedStudent) return receivedStudent;

  const schoolMap = (lookups && lookups.schools) || lookupService.cache.schools;
  const statusMap = (lookups && lookups.studentStatusMap) || lookupService.cache.studentStatusMap;
  const studentStatuses = (lookups && lookups.studentStatuses) || lookupService.cache.studentStatuses || [];

  const {
    school,
    status,
    creator,
    created_at,
    updated_at,
    ...restOfStudentData
  } = receivedStudent;

  const originalStudent = {
    ...restOfStudentData,
  };

  // 1. Resolve school_id from school name
  if (school !== undefined) {
    if (school === null || school === '') {
      originalStudent.school_id = null;
    } else if (schoolMap) {
      let foundSchoolId = null;
      for (const [id, name] of schoolMap.entries()) {
        if (name === school) {
          foundSchoolId = id;
          break;
        }
      }
      if (foundSchoolId !== null) {
        originalStudent.school_id = foundSchoolId;
      }
    }
  }

  // 2. Resolve status_id from status code (e.g. 'ACTIVE') or status name (e.g. 'Đang hỗ trợ')
  if (status !== undefined) {
    if (status === null || status === '') {
      originalStudent.status_id = null;
    } else {
      let foundStatusId = null;
      // Match by code first
      if (statusMap) {
        for (const [id, code] of statusMap.entries()) {
          if (code === status) {
            foundStatusId = id;
            break;
          }
        }
      }
      // Fallback: match by name
      if (foundStatusId === null && Array.isArray(studentStatuses)) {
        const found = studentStatuses.find(s => s.name === status);
        if (found) {
          foundStatusId = found.id;
        }
      }
      if (foundStatusId !== null) {
        originalStudent.status_id = foundStatusId;
      }
    }
  }

  // 3. Handle date_of_birth formatting: ensure string format 'YYYY-MM-DD'
  if (originalStudent.date_of_birth !== undefined && originalStudent.date_of_birth !== null) {
    if (originalStudent.date_of_birth instanceof Date) {
      originalStudent.date_of_birth = originalStudent.date_of_birth.toISOString().split('T')[0];
    } else if (typeof originalStudent.date_of_birth === 'string') {
      originalStudent.date_of_birth = originalStudent.date_of_birth.split('T')[0];
    }
  }

  // 4. Handle timestamp parsing to Date objects (created_at, updated_at)
  if (created_at !== undefined && created_at !== null) {
    originalStudent.created_at = new Date(created_at);
  }
  if (updated_at !== undefined && updated_at !== null) {
    originalStudent.updated_at = new Date(updated_at);
  }

  return originalStudent;
};

module.exports = { formatStudentResponse, parseStudentRequest };
