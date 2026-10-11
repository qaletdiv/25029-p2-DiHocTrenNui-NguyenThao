const lookupService = require('./lookupService');

/**
 * Transforms a raw sponsor object by replacing relation IDs with actual string values
 */
const formatSponsorResponse = (rawSponsor, lookups = null) => {
  if (!rawSponsor) return rawSponsor;

  const accountMap = (lookups && lookups.accounts) || lookupService.cache.accounts;

  const {
    account_id,
    created_by,
    updated_by,
    ...restOfSponsorData
  } = rawSponsor;

  const usernameVal = (accountMap && accountMap.get(account_id)) || rawSponsor.username || null;
  const creatorVal = (accountMap && accountMap.get(created_by)) || rawSponsor.creator || null;
  const updaterVal = (accountMap && accountMap.get(updated_by)) || rawSponsor.updater || null;

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
