const lookupService = require('./lookupService');

/**
 * Transforms a raw school object by replacing relation IDs with actual string values.
 * - account_id  → username (the school's linked account username)
 * - created_by  → creator  (username of whoever created the record)
 * - updated_by  → updater  (username of whoever last updated the record)
 */
const formatSchoolResponse = (rawSchool, lookups = null) => {
  if (!rawSchool) return rawSchool;

  const accountMap = (lookups && lookups.accounts) || lookupService.cache.accounts;

  const {
    account_id,
    created_by,
    updated_by,
    ...restOfSchoolData
  } = rawSchool;

  const usernameVal = (accountMap && accountMap.get(account_id)) || rawSchool.username || null;
  const creatorVal  = (accountMap && accountMap.get(created_by))  || rawSchool.creator  || null;
  const updaterVal  = (accountMap && accountMap.get(updated_by))  || rawSchool.updater  || null;

  return {
    ...restOfSchoolData,
    username: usernameVal,
    creator:  creatorVal,
    updater:  updaterVal,
  };
};

/**
 * Transforms an enriched/received school object from the client back to the database-compatible format.
 * Strips virtual fields and parses timestamp strings back to Date objects.
 */
const parseSchoolRequest = (receivedSchool) => {
  if (!receivedSchool) return receivedSchool;

  const {
    username,
    creator,
    updater,
    created_by,
    updated_by,
    created_at,
    updated_at,
    ...restOfSchoolData
  } = receivedSchool;

  const originalSchool = {
    ...restOfSchoolData,
  };

  // Convert timestamp strings back to Date objects if they exist
  if (created_at !== undefined && created_at !== null) {
    originalSchool.created_at = new Date(created_at);
  }
  if (updated_at !== undefined && updated_at !== null) {
    originalSchool.updated_at = new Date(updated_at);
  }

  return originalSchool;
};

module.exports = { formatSchoolResponse, parseSchoolRequest };
