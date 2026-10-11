const assert = require('assert');
const {
  sequelize,
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
  Account,
  Student,
  School,
  Teacher,
  Volunteer,
  Sponsor,
  BankTransaction,
  SupportDisbursement,
  Image,
  Role,
  Permission,
} = require('../models');

let passed = 0;
let failed = 0;

function logPass(msg) {
  passed++;
  console.log(`  ✓ [PASS] ${msg}`);
}

function logFail(msg, err) {
  failed++;
  console.error(`  ✗ [FAIL] ${msg}`, err ? err.message : '');
}

async function run() {
  console.log('====================================================');
  console.log('  Testing Sequelize Integration with TiDB Cloud');
  console.log('====================================================\n');

  try {
    // 1. Authenticate with TiDB
    await sequelize.authenticate();
    logPass('Sequelize connection authenticated successfully with TiDB');

    // 2. Query Accounts via Sequelize
    const accounts = await AccountModel.findAll();
    assert.ok(accounts.length >= 30, `Expected >= 30 accounts, got ${accounts.length}`);
    const admin = await AccountModel.findByEmail('admin@gmail.com');
    assert.ok(admin, 'admin@gmail.com must exist');
    assert.strictEqual(admin.role_id, 1);
    assert.strictEqual(typeof admin.is_active, 'boolean');
    logPass(`AccountModel: Retrieved ${accounts.length} accounts via Sequelize. Admin id: ${admin.id}`);

    // 3. Query Students via Sequelize
    const students = await StudentModel.findAll();
    assert.ok(students.length >= 30, `Expected >= 30 students, got ${students.length}`);
    const student1 = await StudentModel.findById('HS0001');
    assert.ok(student1, 'HS0001 must exist');
    assert.strictEqual(typeof student1.monthly_amount, 'number');
    assert.strictEqual(typeof student1.is_active, 'boolean');
    logPass(`StudentModel: Retrieved ${students.length} students via Sequelize. HS0001 monthly amount: ${student1.monthly_amount}`);

    // 4. Test Student ID generator via Sequelize
    const nextId = await StudentModel.generateNextId();
    assert.ok(/^HS\d{4}$/.test(nextId), `Generated ID must match HS0000 format, got ${nextId}`);
    logPass(`StudentModel.generateNextId(): Generated ${nextId}`);

    // 5. Query Schools, Teachers, Volunteers, Sponsors via Sequelize
    const schools = await SchoolModel.findAll();
    assert.ok(schools.length >= 5);
    const teachers = await TeacherModel.findAll();
    assert.ok(teachers.length >= 5);
    const volunteers = await VolunteerModel.findAll();
    assert.ok(volunteers.length >= 6);
    const sponsors = await SponsorModel.findAll();
    assert.ok(sponsors.length >= 20);
    logPass(`Entities verified via Sequelize: Schools (${schools.length}), Teachers (${teachers.length}), Volunteers (${volunteers.length}), Sponsors (${sponsors.length})`);

    // 6. Test Sequelize Associations (Eager Loading)
    const teacherWithAssoc = await Teacher.findOne({
      where: { id: 1 },
      include: [
        { model: Account, attributes: ['id', 'email', 'role_id'] },
        { model: School, attributes: ['id', 'name'] },
      ],
    });
    assert.ok(teacherWithAssoc, 'Teacher 1 found with associations');
    assert.ok(teacherWithAssoc.account, 'Associated Account loaded');
    assert.ok(teacherWithAssoc.school, 'Associated School loaded');
    logPass(`Sequelize Associations: Loaded Teacher 1 linked to Account (${teacherWithAssoc.account.email}) and School (${teacherWithAssoc.school.name})`);

    // 7. Query Bank Transactions & Disbursements via Sequelize
    const txs = await BankTransactionModel.findAll();
    const disbs = await SupportDisbursementModel.findAll();
    assert.ok(txs.length >= 3);
    assert.ok(disbs.length >= 2);
    assert.strictEqual(typeof txs[0].amount, 'number');
    assert.strictEqual(typeof disbs[0].amount, 'number');
    logPass(`Bank Transactions (${txs.length}) & Disbursements (${disbs.length}) verified with numeric amounts`);

    // 8. Query Roles and Permissions via Sequelize
    const roles = await RoleModel.findAll();
    assert.strictEqual(roles.length, 4);
    const adminPerms = await PermissionModel.getPermissionCodesByRoleId(1);
    assert.ok(adminPerms.includes('STUDENT_CREATE'));
    logPass(`RBAC verified via Sequelize: 4 roles, Admin has ${adminPerms.length} permissions`);

    // 9. Full Mutation Lifecycle via Sequelize (Create -> Read -> Update -> Delete)
    const testStudentId = 'HS9999';
    // Clean up if leftover
    await Student.destroy({ where: { id: testStudentId } });

    // Create
    const createdStudent = await StudentModel.create({
      id: testStudentId,
      full_name: 'Test Sequelize Student',
      date_of_birth: '2015-05-05',
      gender: 'Nam',
      phone: '0987654321',
      address: 'Test Address',
      school_id: 1,
      grade: '4',
      status_id: 1,
      monthly_amount: 550000,
      is_active: true,
      created_by: 1,
    });
    assert.strictEqual(createdStudent.id, testStudentId);
    assert.strictEqual(createdStudent.full_name, 'Test Sequelize Student');
    logPass('Sequelize Model.create(): Successfully created student HS9999 in TiDB');

    // Read
    const fetchedStudent = await StudentModel.findById(testStudentId);
    assert.ok(fetchedStudent);
    assert.strictEqual(fetchedStudent.full_name, 'Test Sequelize Student');
    logPass('Sequelize Model.findById(): Successfully fetched created student from TiDB');

    // Update
    const updatedStudent = await StudentModel.update(testStudentId, {
      full_name: 'Updated Sequelize Student',
      monthly_amount: 600000,
    });
    assert.strictEqual(updatedStudent.full_name, 'Updated Sequelize Student');
    assert.strictEqual(updatedStudent.monthly_amount, 600000);
    logPass('Sequelize Model.update(): Successfully updated student in TiDB');

    // Delete
    const deleted = await StudentModel.delete(testStudentId);
    assert.strictEqual(deleted, true);
    const postDelete = await StudentModel.findById(testStudentId);
    assert.strictEqual(postDelete, null);
    logPass('Sequelize Model.delete(): Successfully deleted student from TiDB');

    console.log('\n====================================================');
    console.log(`  Sequelize Integration Test Summary`);
    console.log(`  Passed: ${passed} | Failed: ${failed}`);
    console.log('====================================================\n');
  } catch (err) {
    logFail('Test encountered an unhandled exception', err);
    console.error(err);
  } finally {
    await sequelize.close();
  }

  if (failed > 0) {
    process.exit(1);
  }
}

run();
