const jwt = require('jsonwebtoken');
const ROLE_PERMISSIONS = require('../data/role_permission');
const { sendError } = require('../utils/responseHandler');

/**
 * Authentication Middleware
 * Validates JWT token and attaches user/permissions to request
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Authentication required', [], 401);
  }

  const secretKey = req.app.get('SECRET_KEY');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return sendError(res, 'Invalid or expired token', [], 403);
    }

    req.user = user;
    // Attach permissions (ids) to request based on role
    const permissions = require('../data/permissions');
    const rolePermissions = require('../data/role_permission');
    
    const userPermissionIds = rolePermissions
      .filter(rp => rp.role_id === user.role_id)
      .map(rp => rp.permission_id);
    
    req.permissions = permissions.filter(p => userPermissionIds.includes(p.id));
    next();
  });
};

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

    const userPermissions = req.permissions || [];

    const hasPermission = userPermissions.some(p => 
      p.action_id === action.id && p.resource_id === resource.id
    );

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
