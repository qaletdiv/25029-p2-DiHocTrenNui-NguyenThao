const accounts = require('../data/accounts');
const schools = require('../data/schools');

// Pre-compute lookup maps for O(1) access time
const accountMap = new Map(accounts.map(a => [a.id, a.username]));
const schoolMap = new Map(schools.map(s => [s.id, s.name]));

/**
 * Transforms a raw teacher object by replacing relation IDs with actual string values.
 * - account_id  → username (the teacher's linked account username)
 * - school_id    → school   (the teacher's school name)
 * - created_by  → creator  (username of whoever created the record)
 * - updated_by  → updater  (username of whoever last updated the record)
 */
const formatTeacherResponse = (rawTeacher) => {
  if (!rawTeacher) return rawTeacher;

  const {
    account_id,
    school_id,
    created_by,
    updated_by,
    ...restOfTeacherData
  } = rawTeacher;

  const usernameVal = accountMap.get(account_id) || null;
  const schoolVal   = schoolMap.get(school_id) || null;
  const creatorVal  = accountMap.get(created_by)  || null;
  const updaterVal  = accountMap.get(updated_by)  || null;

  return {
    ...restOfTeacherData,
    username: usernameVal,
    school: schoolVal,
    creator:  creatorVal,
    updater:  updaterVal,
  };
};

/**
 * Transforms an enriched/received teacher object from the client back
 * to the database-compatible format (strips virtual fields, parses dates).
 */
const parseTeacherRequest = (receivedTeacher) => {
  if (!receivedTeacher) return receivedTeacher;

  const {
    username,
    school,
    creator,
    updater,
    created_by,
    updated_by,
    created_at,
    updated_at,
    ...restOfTeacherData
  } = receivedTeacher;

  const originalTeacher = {
    ...restOfTeacherData,
  };

  // Resolve school_id from school name
  if (school !== undefined) {
    if (school === null || school === '') {
      originalTeacher.school_id = null;
    } else {
      let foundSchoolId = null;
      for (const [id, name] of schoolMap.entries()) {
        if (name === school) {
          foundSchoolId = id;
          break;
        }
      }
      if (foundSchoolId !== null) {
        originalTeacher.school_id = foundSchoolId;
      }
    }
  }

  // Convert timestamp strings back to Date objects if they exist
  if (created_at !== undefined && created_at !== null) {
    originalTeacher.created_at = new Date(created_at);
  }
  if (updated_at !== undefined && updated_at !== null) {
    originalTeacher.updated_at = new Date(updated_at);
  }

  return originalTeacher;
};

module.exports = { formatTeacherResponse, parseTeacherRequest };
