const jwt = require('jsonwebtoken');
const ROLES = require('../data/roles');
const PERMISSIONS = require('../data/permissions');
const ROLE_PERMISSIONS = require('../data/role_permission');
const { sendError } = require('../utils/responseHandler');

/**
 * Authentication Middleware
 * Validates JWT token and attaches user/permissions to request
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return sendError(res, 'Authentication required', [], 401);
  }

  const secretKey = req.app.get('SECRET_KEY');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return sendError(res, 'Invalid or expired token', [], 403);
    }

    if (!user || user.role_id === undefined || user.role_id === null) {
      return sendError(res, 'Forbidden: Account has no assigned role', [], 403);
    }

    const roleExists = ROLES.some(role => role.id === user.role_id);
    if (!roleExists) {
      return sendError(res, 'Forbidden: Account has an invalid assigned role', [], 403);
    }

    req.user = user;
    
    // Attach permissions (ids) to request based on role
    const userPermissionIds = ROLE_PERMISSIONS
      .filter(rp => rp.role_id === user.role_id)
      .map(rp => rp.permission_id);
    
    req.permissions = PERMISSIONS.filter(p => userPermissionIds.includes(p.id));
    next();
  });
};

const RESOURCES = require('../data/resources');
const ACTIONS = require('../data/actions');

/**
 * Authorization Middleware
 * @param {object} action - Action object from data/actions
 * @param {object} resource - Resource object from data/resources
 */
const authorize = (action, resource) => {
  return (req, res, next) => {
    if (!action || !resource) {
      console.error('Authorization middleware misconfigured: action or resource is missing');
      return sendError(res, 'Internal Server Error: Authorization misconfigured', [], 500);
    }

    if (!req.user || req.user.role_id === undefined || req.user.role_id === null) {
      return sendError(res, 'Forbidden: Account has no assigned role', [], 403);
    }

    const roleExists = ROLES.some(role => role.id === req.user.role_id);
    if (!roleExists) {
      return sendError(res, 'Forbidden: Account has an invalid assigned role', [], 403);
    }

    const userPermissions = req.permissions || [];

    let hasPermission = userPermissions.some(p => 
      p.action_id === action.id && p.resource_id === resource.id
    );

    // Allow users to read or update their own account profile details
    if (!hasPermission && resource.id === RESOURCES.USER.id && req.params.id) {
      const targetUserId = parseInt(req.params.id, 10);
      if (req.user.id === targetUserId && (action.id === ACTIONS.READ.id || action.id === ACTIONS.UPDATE.id)) {
        hasPermission = true;
      }
    }

    if (!hasPermission) {
      return sendError(res, 'Forbidden: Insufficient permissions', [], 403);
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};

