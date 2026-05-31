const accounts = require('../data/accounts');

// Pre-compute lookup map for O(1) access time
const accountMap = new Map(accounts.map(a => [a.id, a.username]));

/**
 * Transforms a raw sponsor object by replacing relation IDs with actual string values
 */
const formatSponsorResponse = (rawSponsor) => {
  if (!rawSponsor) return rawSponsor;

  const {
    account_id,
    created_by,
    updated_by,
    ...restOfSponsorData
  } = rawSponsor;

  const usernameVal = accountMap.get(account_id) || null;
  const creatorVal = accountMap.get(created_by) || null;
  const updaterVal = accountMap.get(updated_by) || null;

  return {
    ...restOfSponsorData,
    username: usernameVal,
    creator: creatorVal,
    updater: updaterVal,
  };
};

/**
 * Transforms an enriched/received sponsor object from the client back to the database-compatible format.
 */
const parseSponsorRequest = (receivedSponsor) => {
  if (!receivedSponsor) return receivedSponsor;

  const {
    username,
    creator,
    updater,
    created_by,
    updated_by,
    created_at,
    updated_at,
    ...restOfSponsorData
  } = receivedSponsor;

  const originalSponsor = {
    ...restOfSponsorData,
  };

  // Convert timestamp strings back to Date objects if they exist
  if (created_at !== undefined && created_at !== null) {
    originalSponsor.created_at = new Date(created_at);
  }
  if (updated_at !== undefined && updated_at !== null) {
    originalSponsor.updated_at = new Date(updated_at);
  }

  return originalSponsor;
};

module.exports = { formatSponsorResponse, parseSponsorRequest };
