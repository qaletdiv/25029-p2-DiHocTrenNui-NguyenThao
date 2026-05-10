const jwt = require('jsonwebtoken');
const ROLE_PERMISSIONS = require('../data/role_permission');
const { sendError } = require('../utils/responseHandler');

/**
 * Authentication Middleware
 * Validates JWT token and attaches user/permissions to request
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return sendError(res, 'Authentication required', [], 401);
  }

  // Use the SECRET_KEY set in app.set('SECRET_KEY', ...)
  const secretKey = req.app.get('SECRET_KEY');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return sendError(res, 'Invalid or expired token', [], 403);
    }

    req.user = user;
    // Attach permissions to request based on role from static data
    req.permissions = ROLE_PERMISSIONS[user.role] || [];
    next();
  });
};

/**
 * Authorization Middleware
 * @param {string} action - The action to check (e.g., 'read') or full permission string (e.g., 'user:read')
 * @param {string} [resource] - The resource to check (e.g., 'user')
 */
const authorize = (action, resource) => {
  return (req, res, next) => {
    // Support both (action, resource) and (fullPermissionString)
    const requiredPermission = resource ? `${resource}:${action}` : action;
    const userPermissions = req.permissions || [];

    if (!userPermissions.includes(requiredPermission)) {
      return sendError(res, 'Forbidden: Insufficient permissions', [], 403);
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
