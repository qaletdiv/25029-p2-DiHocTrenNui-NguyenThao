const { sequelize, DataTypes } = require('../config/sequelize');

const commonOptions = {
  timestamps: false,
  freezeTableName: true,
  underscored: true,
};

// 1. Roles
const Role = sequelize.define('roles', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { ...commonOptions, tableName: 'roles' });

// 2. Actions
const Action = sequelize.define('actions', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { ...commonOptions, tableName: 'actions' });

// 3. Resources
const Resource = sequelize.define('resources', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { ...commonOptions, tableName: 'resources' });

// 4. Permissions
const Permission = sequelize.define('permissions', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  resource_id: { type: DataTypes.INTEGER, allowNull: false },
  action_id: { type: DataTypes.INTEGER, allowNull: false },
  code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
}, { ...commonOptions, tableName: 'permissions' });

// 5. Role Permissions
const RolePermission = sequelize.define('role_permissions', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  permission_id: { type: DataTypes.INTEGER, allowNull: false },
}, { ...commonOptions, tableName: 'role_permissions' });

// 6. Student Statuses
const StudentStatus = sequelize.define('student_statuses', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { ...commonOptions, tableName: 'student_statuses' });

// 7. Bank Transaction Statuses
const BankTransactionStatus = sequelize.define('bank_transaction_statuses', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { ...commonOptions, tableName: 'bank_transaction_statuses' });

// 8. Disbursement Statuses
const DisbursementStatus = sequelize.define('disbursement_statuses', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { ...commonOptions, tableName: 'disbursement_statuses' });

// 9. Accounts
const Account = sequelize.define('accounts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { ...commonOptions, tableName: 'accounts' });

// 10. Schools
const School = sequelize.define('schools', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(50) },
  email: { type: DataTypes.STRING(255) },
  address: { type: DataTypes.TEXT },
  note: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'schools' });

// 11. Teachers
const Teacher = sequelize.define('teachers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  account_id: { type: DataTypes.INTEGER },
  school_id: { type: DataTypes.INTEGER },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(50) },
  gender: { type: DataTypes.STRING(20) },
  address: { type: DataTypes.TEXT },
  note: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'teachers' });

// 12. Volunteers
const Volunteer = sequelize.define('volunteers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  account_id: { type: DataTypes.INTEGER },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(50) },
  gender: { type: DataTypes.STRING(20) },
  address: { type: DataTypes.TEXT },
  note: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'volunteers' });

// 13. Sponsors
const Sponsor = sequelize.define('sponsors', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  account_id: { type: DataTypes.INTEGER },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(50) },
  gender: { type: DataTypes.STRING(20) },
  address: { type: DataTypes.TEXT },
  note: { type: DataTypes.TEXT },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'sponsors' });

// 14. Students
const Student = sequelize.define('students', {
  id: { type: DataTypes.STRING(50), primaryKey: true },
  full_name: { type: DataTypes.STRING(255), allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.STRING(20) },
  phone: { type: DataTypes.STRING(50) },
  address: { type: DataTypes.TEXT },
  school_id: { type: DataTypes.INTEGER },
  grade: { type: DataTypes.STRING(50) },
  family_condition: { type: DataTypes.TEXT },
  status_id: { type: DataTypes.INTEGER },
  monthly_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  avatar_url: { type: DataTypes.STRING(500) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'students' });

// 15. Teacher Students
const TeacherStudent = sequelize.define('teacher_students', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.STRING(50), allowNull: false },
  teacher_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'teacher_students' });

// 16. Volunteer Students
const VolunteerStudent = sequelize.define('volunteer_students', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.STRING(50), allowNull: false },
  volunteer_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'volunteer_students' });

// 17. Sponsor Students
const SponsorStudent = sequelize.define('sponsor_students', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.STRING(50), allowNull: false },
  sponsor_id: { type: DataTypes.INTEGER, allowNull: false },
  monthly_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'sponsor_students' });

// 18. Bank Transactions
const BankTransaction = sequelize.define('bank_transactions', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sponsor_id: { type: DataTypes.INTEGER },
  transaction_code: { type: DataTypes.STRING(100) },
  bank_name: { type: DataTypes.STRING(100) },
  account_number: { type: DataTypes.STRING(100) },
  transfer_date: { type: DataTypes.DATE },
  amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  transfer_content: { type: DataTypes.TEXT },
  status_id: { type: DataTypes.INTEGER },
  verified_by: { type: DataTypes.INTEGER },
  verified_at: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'bank_transactions' });

// 19. Support Disbursements
const SupportDisbursement = sequelize.define('support_disbursements', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bank_transaction_id: { type: DataTypes.INTEGER },
  sponsor_student_id: { type: DataTypes.INTEGER },
  student_id: { type: DataTypes.STRING(50) },
  teacher_id: { type: DataTypes.INTEGER },
  support_month: { type: DataTypes.INTEGER },
  support_year: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  delivered_at: { type: DataTypes.DATE },
  status_id: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE },
}, { ...commonOptions, tableName: 'support_disbursements' });

// 20. Images
const Image = sequelize.define('images', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.STRING(50) },
  event_id: { type: DataTypes.STRING(100) },
  timestamp: { type: DataTypes.DATE },
  url: { type: DataTypes.STRING(500) },
  metadata: { type: DataTypes.JSON },
}, { ...commonOptions, tableName: 'images' });

// 21. Logs
const Log = sequelize.define('logs', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  timestamp: { type: DataTypes.DATE },
  user_id: { type: DataTypes.STRING(50) },
  action: { type: DataTypes.STRING(100) },
  details: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING(50) },
}, { ...commonOptions, tableName: 'logs' });

// --- Associations ---
// Roles <-> Permissions (M:N via role_permissions)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
});

// Accounts -> Teachers, Volunteers, Sponsors
Account.hasOne(Teacher, { foreignKey: 'account_id' });
Teacher.belongsTo(Account, { foreignKey: 'account_id' });

Account.hasOne(Volunteer, { foreignKey: 'account_id' });
Volunteer.belongsTo(Account, { foreignKey: 'account_id' });

Account.hasOne(Sponsor, { foreignKey: 'account_id' });
Sponsor.belongsTo(Account, { foreignKey: 'account_id' });

// Schools -> Teachers, Students
School.hasMany(Teacher, { foreignKey: 'school_id' });
Teacher.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(Student, { foreignKey: 'school_id' });
Student.belongsTo(School, { foreignKey: 'school_id' });

// Students -> Status
Student.belongsTo(StudentStatus, { foreignKey: 'status_id' });

// Student Relations
TeacherStudent.belongsTo(Teacher, { foreignKey: 'teacher_id' });
TeacherStudent.belongsTo(Student, { foreignKey: 'student_id' });

VolunteerStudent.belongsTo(Volunteer, { foreignKey: 'volunteer_id' });
VolunteerStudent.belongsTo(Student, { foreignKey: 'student_id' });

SponsorStudent.belongsTo(Sponsor, { foreignKey: 'sponsor_id' });
SponsorStudent.belongsTo(Student, { foreignKey: 'student_id' });

// Bank Transactions
BankTransaction.belongsTo(Sponsor, { foreignKey: 'sponsor_id' });
BankTransaction.belongsTo(BankTransactionStatus, { foreignKey: 'status_id' });

// Support Disbursements
SupportDisbursement.belongsTo(BankTransaction, { foreignKey: 'bank_transaction_id' });
SupportDisbursement.belongsTo(Student, { foreignKey: 'student_id' });
SupportDisbursement.belongsTo(Teacher, { foreignKey: 'teacher_id' });
SupportDisbursement.belongsTo(DisbursementStatus, { foreignKey: 'status_id' });

// Images
Image.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = {
  Role,
  Action,
  Resource,
  Permission,
  RolePermission,
  StudentStatus,
  BankTransactionStatus,
  DisbursementStatus,
  Account,
  School,
  Teacher,
  Volunteer,
  Sponsor,
  Student,
  TeacherStudent,
  VolunteerStudent,
  SponsorStudent,
  BankTransaction,
  SupportDisbursement,
  Image,
  Log,
};
