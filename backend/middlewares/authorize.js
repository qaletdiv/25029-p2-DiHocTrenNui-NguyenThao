const jwt = require('jsonwebtoken');
const RoleModel = require('../models/RoleModel');
const PermissionModel = require('../models/PermissionModel');
const { sendError } = require('../utils/responseHandler');

const ACTIONS = {
  CREATE: { id: 1, code: 'CREATE', name: 'Create' },
  READ: { id: 2, code: 'READ', name: 'Read' },
  UPDATE: { id: 3, code: 'UPDATE', name: 'Update' },
  DELETE: { id: 4, code: 'DELETE', name: 'Delete' },
  APPROVE: { id: 5, code: 'APPROVE', name: 'Approve' },
};

const RESOURCES = {
  STUDENT: { id: 1, code: 'STUDENT', name: 'Student' },
  SPONSOR: { id: 2, code: 'SPONSOR', name: 'Sponsor' },
  SCHOOL: { id: 3, code: 'SCHOOL', name: 'School' },
  BANK_TRANSACTION: { id: 4, code: 'BANK_TRANSACTION', name: 'Bank Transaction' },
  USER: { id: 5, code: 'USER', name: 'User' },
  IMAGE: { id: 6, code: 'IMAGE', name: 'Image' },
  REPORT: { id: 7, code: 'REPORT', name: 'Report' },
  DISBURSEMENT: { id: 8, code: 'DISBURSEMENT', name: 'Disbursement' },
  TEACHER: { id: 9, code: 'TEACHER', name: 'Teacher' },
  VOLUNTEER: { id: 10, code: 'VOLUNTEER', name: 'Volunteer' },
};

/**
 * Authentication Middleware
 * Validates JWT token and attaches user and real-time TiDB permissions to request
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

  jwt.verify(token, secretKey, async (err, user) => {
    if (err) {
      return sendError(res, 'Invalid or expired token', [], 403);
    }

    if (!user || user.role_id === undefined || user.role_id === null) {
      return sendError(res, 'Forbidden: Account has no assigned role', [], 403);
    }

    try {
      const role = await RoleModel.findById(user.role_id);
      if (!role) {
        return sendError(res, 'Forbidden: Account has an invalid assigned role', [], 403);
      }

      req.user = user;
      // Fetch permissions for this role directly from TiDB
      req.permissions = await PermissionModel.findByRoleId(user.role_id);
      next();
    } catch (dbError) {
      console.error('[TiDB Auth Error]', dbError.message);
      return sendError(res, 'Database error during authentication', dbError.message, 500);
    }
  });
};

/**
 * Authorization Middleware
 * @param {object} action - Action definition
 * @param {object} resource - Resource definition
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
  ACTIONS,
  RESOURCES,
};
