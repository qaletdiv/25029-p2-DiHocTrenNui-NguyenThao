const schools = require('../data/schools');
const studentStatuses = require('../data/student_statuses');
const accounts = require('../data/accounts');

// Pre-compute lookup maps for O(1) access time
const schoolMap = new Map(schools.map(s => [s.id, s.name]));
const statusMap = new Map(studentStatuses.map(s => [s.id, s.code]));
const accountMap = new Map(accounts.map(a => [a.id, a.username]));

/**
 * Transforms a raw student object by replacing relation IDs with actual string values
 */
const formatStudentResponse = (rawStudent) => {
  if (!rawStudent) return rawStudent;

  const {
    school_id,
    status_id,
    created_by,
    updated_by,
    ...restOfStudentData
  } = rawStudent;

  return {
    ...restOfStudentData,
    school: schoolMap.get(school_id) || null,
    status: statusMap.get(status_id) || null,
    creator: accountMap.get(created_by) || null,
    updater: accountMap.get(updated_by) || null,
  };
};

/**
 * Transforms an enriched/received student object from the client back to the database-compatible format.
 * This resolves virtual text fields (address, school, status) to their foreign key IDs (address_id, school_id, status_id),
 * parses ISO strings to Date objects for timestamps, and removes extra visual helper properties.
 */
const parseStudentRequest = (receivedStudent) => {
  if (!receivedStudent) return receivedStudent;

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

  // 2. Resolve school_id from school name
  if (school !== undefined) {
    if (school === null || school === '') {
      originalStudent.school_id = null;
    } else {
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

  // 3. Resolve status_id from status code (e.g. 'ACTIVE') or status name (e.g. 'Đang hỗ trợ')
  if (status !== undefined) {
    if (status === null || status === '') {
      originalStudent.status_id = null;
    } else {
      let foundStatusId = null;
      // Match by code first
      for (const [id, code] of statusMap.entries()) {
        if (code === status) {
          foundStatusId = id;
          break;
        }
      }
      // Fallback: match by name
      if (foundStatusId === null) {
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

  // 4. Handle date_of_birth formatting: ensure string format 'YYYY-MM-DD'
  if (originalStudent.date_of_birth !== undefined && originalStudent.date_of_birth !== null) {
    if (originalStudent.date_of_birth instanceof Date) {
      originalStudent.date_of_birth = originalStudent.date_of_birth.toISOString().split('T')[0];
    } else if (typeof originalStudent.date_of_birth === 'string') {
      originalStudent.date_of_birth = originalStudent.date_of_birth.split('T')[0];
    }
  }

  // 5. Handle timestamp parsing to Date objects (created_at, updated_at)
  if (created_at !== undefined && created_at !== null) {
    originalStudent.created_at = new Date(created_at);
  }
  if (updated_at !== undefined && updated_at !== null) {
    originalStudent.updated_at = new Date(updated_at);
  }

  return originalStudent;
};

module.exports = { formatStudentResponse, parseStudentRequest };
