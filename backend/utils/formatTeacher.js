const lookupService = require('./lookupService');

/**
 * Transforms a raw teacher object by replacing relation IDs with actual string values.
 * - account_id  → username (the teacher's linked account username)
 * - school_id    → school   (the teacher's school name)
 * - created_by  → creator  (username of whoever created the record)
 * - updated_by  → updater  (username of whoever last updated the record)
 */
const formatTeacherResponse = (rawTeacher, lookups = null) => {
  if (!rawTeacher) return rawTeacher;

  const accountMap = (lookups && lookups.accounts) || lookupService.cache.accounts;
  const schoolMap  = (lookups && lookups.schools)  || lookupService.cache.schools;

  const {
    account_id,
    school_id,
    created_by,
    updated_by,
    ...restOfTeacherData
  } = rawTeacher;

  const usernameVal = (accountMap && accountMap.get(account_id)) || rawTeacher.username || null;
  const schoolVal   = (schoolMap  && schoolMap.get(school_id))   || rawTeacher.school   || null;
  const creatorVal  = (accountMap && accountMap.get(created_by))  || rawTeacher.creator  || null;
  const updaterVal  = (accountMap && accountMap.get(updated_by))  || rawTeacher.updater  || null;

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
const parseTeacherRequest = (receivedTeacher, lookups = null) => {
  if (!receivedTeacher) return receivedTeacher;

  const schoolMap = (lookups && lookups.schools) || lookupService.cache.schools;

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
    } else if (schoolMap) {
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
