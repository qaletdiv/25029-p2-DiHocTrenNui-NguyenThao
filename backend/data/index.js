const users = require('./users');
const students = require('./students');
const sponsors = require('./sponsors');
const schools = require('./schools');
const transactions = require('./transactions');
const images = require('./images');
const logs = require('./logs');
const constants = require('./constants');
const ROLES = require('./roles');
const PERMISSIONS = require('./permissions');
const ACTIONS = require('./actions');
const RESOURCES = require('./resources');
const ROLE_PERMISSIONS = require('./role_permission');

module.exports = {
  users,
  students,
  sponsors,
  schools,
  transactions,
  images,
  logs,
  constants,
  ROLES,
  PERMISSIONS,
  ACTIONS,
  RESOURCES,
  ROLE_PERMISSIONS,
};
