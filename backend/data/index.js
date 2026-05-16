const accounts = require('./accounts');
const students = require('./students');
const sponsors = require('./sponsors');
const teachers = require('./teachers');
const volunteers = require('./volunteers');
const schools = require('./schools');
const bank_transactions = require('./bank_transactions');
const support_disbursements = require('./support_disbursements');
const images = require('./images');
const logs = require('./logs');
const constants = require('./constants');
const ROLES = require('./roles');
const PERMISSIONS = require('./permissions');
const ACTIONS = require('./actions');
const RESOURCES = require('./resources');
const ROLE_PERMISSIONS = require('./role_permission');
const student_statuses = require('./student_statuses');
const bank_transaction_statuses = require('./bank_transaction_statuses');
const disbursement_statuses = require('./disbursement_statuses');
const provinces = require('./provinces');
const wards = require('./wards');
const addresses = require('./addresses');
const teacher_students = require('./teacher_students');
const volunteer_students = require('./volunteer_students');
const sponsor_students = require('./sponsor_students');

module.exports = {
  accounts,
  students,
  sponsors,
  teachers,
  volunteers,
  schools,
  bank_transactions,
  support_disbursements,
  images,
  logs,
  constants,
  ROLES,
  PERMISSIONS,
  ACTIONS,
  RESOURCES,
  ROLE_PERMISSIONS,
  student_statuses,
  bank_transaction_statuses,
  disbursement_statuses,
  provinces,
  wards,
  addresses,
  teacher_students,
  volunteer_students,
  sponsor_students,
};

