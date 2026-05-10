const ROLE_PERMISSIONS = require('../data/role_permission');
const { sendError } = require('../utils/responseHandler');

/**
 * Authorize Middleware
 * @param {string} action - The action to check (from actions.js)
 * @param {string} resource - The resource to check (from resources.js)
 */
const authorize = (action, resource) => {
  return (req, res, next) => {
    const requiredPermission = `${resource}:${action}`;
    const userPermissions = req.permissions || [];

    if (!userPermissions.includes(requiredPermission)) {
      return sendError(res, 'Forbidden: Insufficient permissions', [], 403);
    }
    next();
  };
};

module.exports = authorize;
