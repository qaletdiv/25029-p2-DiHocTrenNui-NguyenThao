const PERMISSIONS = {
  STUDENT: {
    CREATE: 'student:create',
    READ: 'student:read',
    UPDATE: 'student:update',
    DELETE: 'student:delete',
  },
  SPONSOR: {
    CREATE: 'sponsor:create',
    READ: 'sponsor:read',
    UPDATE: 'sponsor:update',
    DELETE: 'sponsor:delete',
  },
  SCHOOL: {
    CREATE: 'school:create',
    READ: 'school:read',
    UPDATE: 'school:update',
    DELETE: 'school:delete',
  },
  TRANSACTION: {
    CREATE: 'transaction:create',
    READ: 'transaction:read',
    UPDATE: 'transaction:update',
    DELETE: 'transaction:delete',
  },
  REPORT: {
    READ: 'report:read',
  },
  USER: {
    CREATE: 'user:create',
    READ: 'user:read',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
  },
};

module.exports = PERMISSIONS;