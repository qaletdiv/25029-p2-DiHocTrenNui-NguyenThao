const accounts = require('../data/accounts');

// Pre-compute lookup map for O(1) access time
const accountMap = new Map(accounts.map(a => [a.id, a.username]));

/**
 * Transforms a raw volunteer object by replacing relation IDs with actual string values.
 * - account_id  → username (the volunteer's linked account username)
 * - created_by  → creator  (username of whoever created the record)
 * - updated_by  → updater  (username of whoever last updated the record)
 */
const formatVolunteerResponse = (rawVolunteer) => {
  if (!rawVolunteer) return rawVolunteer;

  const {
    account_id,
    created_by,
    updated_by,
    ...restOfVolunteerData
  } = rawVolunteer;

  const usernameVal = accountMap.get(account_id) || null;
  const creatorVal  = accountMap.get(created_by)  || null;
  const updaterVal  = accountMap.get(updated_by)  || null;

  return {
    ...restOfVolunteerData,
    username: usernameVal,
    creator:  creatorVal,
    updater:  updaterVal,
  };
};

/**
 * Transforms an enriched/received volunteer object from the client back to the database-compatible format.
 * Strips virtual fields and parses timestamp strings back to Date objects.
 */
const parseVolunteerRequest = (receivedVolunteer) => {
  if (!receivedVolunteer) return receivedVolunteer;

  const {
    username,
    creator,
    updater,
    created_by,
    updated_by,
    created_at,
    updated_at,
    ...restOfVolunteerData
  } = receivedVolunteer;

  const originalVolunteer = {
    ...restOfVolunteerData,
  };

  // Convert timestamp strings back to Date objects if they exist
  if (created_at !== undefined && created_at !== null) {
    originalVolunteer.created_at = new Date(created_at);
  }
  if (updated_at !== undefined && updated_at !== null) {
    originalVolunteer.updated_at = new Date(updated_at);
  }

  return originalVolunteer;
};

module.exports = { formatVolunteerResponse, parseVolunteerRequest };
