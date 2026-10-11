const { sequelize, Sequelize, DataTypes, Op } = require('../config/sequelize');
const schemas = require('./schemas');
const BaseModel = require('./BaseModel');

const AccountModel = require('./AccountModel');
const StudentModel = require('./StudentModel');
const SchoolModel = require('./SchoolModel');
const TeacherModel = require('./TeacherModel');
const VolunteerModel = require('./VolunteerModel');
const SponsorModel = require('./SponsorModel');
const BankTransactionModel = require('./BankTransactionModel');
const SupportDisbursementModel = require('./SupportDisbursementModel');
const ImageModel = require('./ImageModel');
const RoleModel = require('./RoleModel');
const PermissionModel = require('./PermissionModel');
const TeacherStudentModel = require('./TeacherStudentModel');
const VolunteerStudentModel = require('./VolunteerStudentModel');
const SponsorStudentModel = require('./SponsorStudentModel');

module.exports = {
  // Configuration & Utilities
  sequelize,
  Sequelize,
  DataTypes,
  Op,
  BaseModel,

  // High-level App Models
  AccountModel,
  StudentModel,
  SchoolModel,
  TeacherModel,
  VolunteerModel,
  SponsorModel,
  BankTransactionModel,
  SupportDisbursementModel,
  ImageModel,
  RoleModel,
  PermissionModel,
  TeacherStudentModel,
  VolunteerStudentModel,
  SponsorStudentModel,

  // Direct Sequelize Entity Schemas
  ...schemas,
  schemas,
};
