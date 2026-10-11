/**
 * Comprehensive Verification Test Suite for TiDB Migration
 * Tests:
 * 1. TiDB Connection Pool
 * 2. Repository Layer (BaseModel & Entity Models)
 * 3. RBAC & Permissions from TiDB
 * 4. Relational Mappings (teacher_students, volunteer_students, sponsor_students)
 * 5. Formatting & Lookup Service
 * 6. API Endpoints & Auth (Login, Protected Routes, Role Restrictions)
 */

const assert = require('assert');
const http = require('http');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Models
const AccountModel = require('../models/AccountModel');
const StudentModel = require('../models/StudentModel');
const SchoolModel = require('../models/SchoolModel');
const TeacherModel = require('../models/TeacherModel');
const VolunteerModel = require('../models/VolunteerModel');
const SponsorModel = require('../models/SponsorModel');
const BankTransactionModel = require('../models/BankTransactionModel');
const SupportDisbursementModel = require('../models/SupportDisbursementModel');
const ImageModel = require('../models/ImageModel');
const RoleModel = require('../models/RoleModel');
const PermissionModel = require('../models/PermissionModel');
const SponsorStudentModel = require('../models/SponsorStudentModel');
const TeacherStudentModel = require('../models/TeacherStudentModel');
const VolunteerStudentModel = require('../models/VolunteerStudentModel');

// Utils
const lookupService = require('../utils/lookupService');
const { getTeacherLinkedResources } = require('../utils/teacherAuth');
const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
const { formatStudentResponse } = require('../utils/formatStudent');
const { formatDisbursementResponse } = require('../utils/formatDisbursement');

// App
const app = require('../server');

let passedTests = 0;
let failedTests = 0;

function logPass(msg) {
  passedTests++;
  console.log(`  ✓ [PASS] ${msg}`);
}

function logFail(msg, err) {
  failedTests++;
  console.error(`  ✗ [FAIL] ${msg}`, err ? err.message : '');
}

async function testSection(title, fn) {
  console.log(`\n==================================================`);
  console.log(`  ${title}`);
  console.log(`==================================================`);
  try {
    await fn();
  } catch (err) {
    logFail(`Unexpected error in section: ${title}`, err);
  }
}

// Helper to make local HTTP requests to Express app
function makeRequest(serverInstance, method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const port = serverInstance.address().port;
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = { ...headers };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: 'localhost',
      port,
      path,
      method,
      headers: reqHeaders,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runAllTests() {
  const startTime = Date.now();
  console.log('Starting TiDB Migration Verification Suite...\n');

  // Start temporary test server
  const testServer = await new Promise(resolve => {
    const s = app.listen(0, () => resolve(s));
  });
  const serverPort = testServer.address().port;
  console.log(`Test server active on ephemeral port: ${serverPort}`);

  try {
    // 1. Connection Pool Verification
    await testSection('1. TiDB Connection & Pool Verification', async () => {
      const isConnected = await db.testConnection();
      assert.strictEqual(isConnected, true, 'TiDB pool should connect successfully');
      logPass('Connected to TiDB cluster over secure TLS pool');

      const [rows] = await db.query('SELECT DATABASE() as dbName, VERSION() as ver');
      assert.ok(rows[0].dbName, 'Should return active database name');
      logPass(`Database: ${rows[0].dbName}, Version: ${rows[0].ver}`);
    });

    // 2. Repository Layer & Entity Operations
    await testSection('2. Entity Repositories & TiDB Queries', async () => {
      // Accounts
      const accounts = await AccountModel.findAll();
      assert.ok(accounts.length >= 30, `Expected at least 30 accounts in TiDB, got ${accounts.length}`);
      const admin = await AccountModel.findByEmail('admin@gmail.com');
      assert.ok(admin, 'Admin account admin@gmail.com should exist');
      assert.strictEqual(admin.role_id, 1, 'Admin role_id should be 1');
      assert.strictEqual(typeof admin.is_active, 'boolean', 'is_active should be cast to boolean');
      logPass(`AccountModel: Verified ${accounts.length} accounts, found admin user (id: ${admin.id})`);

      // Students
      const students = await StudentModel.findAll();
      assert.ok(students.length >= 30, `Expected at least 30 students in TiDB, got ${students.length}`);
      const student1 = await StudentModel.findById('HS0001');
      assert.ok(student1, 'Student HS0001 should exist');
      assert.strictEqual(typeof student1.monthly_amount, 'number', 'monthly_amount should be JS number');
      assert.strictEqual(student1.date_of_birth, '2011-11-25', 'date_of_birth should match format');
      logPass(`StudentModel: Verified ${students.length} students in TiDB with correct types`);

      // Schools
      const schools = await SchoolModel.findAll();
      assert.ok(schools.length >= 5, 'Expected schools in TiDB');
      logPass(`SchoolModel: Verified ${schools.length} schools in TiDB`);

      // Teachers, Volunteers, Sponsors
      const teachers = await TeacherModel.findAll();
      const volunteers = await VolunteerModel.findAll();
      const sponsors = await SponsorModel.findAll();
      assert.ok(teachers.length >= 5, 'Teachers found');
      assert.ok(volunteers.length >= 6, 'Volunteers found');
      assert.ok(sponsors.length >= 20, 'Sponsors found');
      logPass(`Teachers (${teachers.length}), Volunteers (${volunteers.length}), Sponsors (${sponsors.length}) verified`);

      // Bank Transactions & Disbursements
      const transactions = await BankTransactionModel.findAll();
      const disbursements = await SupportDisbursementModel.findAll();
      assert.ok(transactions.length >= 3, 'Transactions found');
      assert.ok(disbursements.length >= 2, 'Disbursements found');
      assert.strictEqual(typeof transactions[0].amount, 'number', 'Transaction amount is number');
      assert.strictEqual(typeof disbursements[0].amount, 'number', 'Disbursement amount is number');
      logPass(`Bank Transactions (${transactions.length}) and Disbursements (${disbursements.length}) verified`);
    });

    // 3. RBAC & Permission Model
    await testSection('3. RBAC Roles & Permissions from TiDB', async () => {
      const roles = await RoleModel.findAll();
      assert.strictEqual(roles.length, 4, 'Should have 4 roles (ADMIN, VOLUNTEER, TEACHER, SPONSOR)');
      logPass('RoleModel: 4 roles verified in TiDB');

      const adminPerms = await PermissionModel.getPermissionCodesByRoleId(1);
      assert.ok(adminPerms.length >= 35, `Admin should have full permissions, got ${adminPerms.length}`);
      assert.ok(adminPerms.includes('STUDENT_CREATE'), 'Admin should have STUDENT_CREATE');
      logPass(`PermissionModel: Admin has ${adminPerms.length} permissions in TiDB`);

      const sponsorPerms = await PermissionModel.getPermissionCodesByRoleId(4);
      assert.ok(!sponsorPerms.includes('STUDENT_CREATE'), 'Sponsor should NOT have STUDENT_CREATE');
      logPass('PermissionModel: Sponsor role correctly restricted from STUDENT_CREATE');
    });

    // 4. Linked Resource Authorization
    await testSection('4. ABAC Linked Resource Relations in TiDB', async () => {
      // Teacher account id 7 -> teacher id 1
      const teacherLinked = await getTeacherLinkedResources(7);
      assert.strictEqual(teacherLinked.teacherId, 1, 'Teacher account 7 should map to teacher ID 1');
      assert.ok(teacherLinked.studentIds.includes('HS0001'), 'Teacher 1 should be linked to student HS0001');
      assert.ok(teacherLinked.schoolIds.includes(1), 'Teacher 1 should be linked to school 1');
      logPass('TeacherAuth: Successfully retrieved linked resources from TiDB');

      // Sponsor account id 12 -> sponsor id 1
      const sponsorLinked = await getSponsorLinkedResources(12);
      assert.strictEqual(sponsorLinked.sponsorId, 1, 'Sponsor account 12 should map to sponsor ID 1');
      assert.ok(sponsorLinked.studentIds.length > 0, 'Sponsor 1 should have linked students');
      logPass('SponsorAuth: Successfully retrieved linked resources from TiDB');

      // Volunteer account id 2 -> volunteer id 1
      const volunteerLinked = await getVolunteerLinkedResources(2);
      assert.strictEqual(volunteerLinked.volunteerId, 1, 'Volunteer account 2 should map to volunteer ID 1');
      assert.ok(volunteerLinked.studentIds.length > 0, 'Volunteer 1 should have linked students');
      logPass('VolunteerAuth: Successfully retrieved linked resources from TiDB');
    });

    // 5. Lookup Service & Formatting
    await testSection('5. Lookup Service & Response Formatting', async () => {
      await lookupService.refresh();
      const rawStudent = await StudentModel.findById('HS0001');
      const formatted = formatStudentResponse(rawStudent);
      assert.ok(formatted.school, 'Formatted student should resolve school name string');
      assert.ok(formatted.status, 'Formatted student should resolve status code string');
      assert.ok(formatted.creator, 'Formatted student should resolve creator username string');
      assert.strictEqual(formatted.school_id, undefined, 'Raw foreign key school_id should be omitted');
      logPass(`formatStudentResponse: Successfully enriched HS0001 with school "${formatted.school}"`);

      const rawDisbursement = await SupportDisbursementModel.findById(1);
      const formattedDisbursement = formatDisbursementResponse(rawDisbursement);
      assert.strictEqual(formattedDisbursement.student_name, 'Huỳnh Hữu Khoa');
      assert.strictEqual(formattedDisbursement.status, 'DELIVERED_TO_STUDENT');
      assert.strictEqual(formattedDisbursement.transaction_code, 'TX1001');
      logPass('formatDisbursementResponse: Successfully resolved student, status, and transaction code');
    });

    // 6. Live API Contract & HTTP Route Tests
    let adminToken = '';
    let sponsorToken = '';

    await testSection('6. Live Authentication Endpoints (POST /login)', async () => {
      // Login with valid admin credentials
      const loginRes = await makeRequest(testServer, 'POST', '/login', {}, {
        email: 'admin@gmail.com',
        password: '123456',
      });
      assert.strictEqual(loginRes.status, 200, 'Login should succeed with 200');
      assert.strictEqual(loginRes.body.success, true);
      assert.ok(loginRes.body.data.accessToken, 'Access token must be returned');
      assert.ok(loginRes.body.data.user.permissions.length > 0, 'Permissions array returned');
      adminToken = loginRes.body.data.accessToken;
      logPass('POST /login: Admin authenticated with JWT and permissions from TiDB');

      // Login as sponsor
      const sponsorLogin = await makeRequest(testServer, 'POST', '/login', {}, {
        email: 'sponsor1@gmail.com',
        password: '123456',
      });
      assert.strictEqual(sponsorLogin.status, 200);
      sponsorToken = sponsorLogin.body.data.accessToken;
      logPass('POST /login: Sponsor authenticated with JWT');

      // Login with bad password
      const badLogin = await makeRequest(testServer, 'POST', '/login', {}, {
        email: 'admin@gmail.com',
        password: 'wrongpassword',
      });
      assert.strictEqual(badLogin.status, 401, 'Bad credentials should return 401');
      logPass('POST /login: Correctly rejected invalid credentials with 401');
    });

    // 7. Protected Data Fetching & Authorization
    await testSection('7. Protected API Endpoints & Role Authorization', async () => {
      // GET /students with admin token
      const studentsRes = await makeRequest(testServer, 'GET', '/students?page=1&pageSize=5', {
        Authorization: `Bearer ${adminToken}`,
      });
      assert.strictEqual(studentsRes.status, 200);
      assert.strictEqual(studentsRes.body.data.students.length, 5);
      assert.ok(studentsRes.body.data.total >= 30);
      logPass(`GET /students: Admin retrieved paginated students (total: ${studentsRes.body.data.total})`);

      // GET /students with sponsor token (filtered by sponsor's linked students)
      const sponsorStudentsRes = await makeRequest(testServer, 'GET', '/students', {
        Authorization: `Bearer ${sponsorToken}`,
      });
      assert.strictEqual(sponsorStudentsRes.status, 200);
      assert.ok(sponsorStudentsRes.body.data.students.length <= 5, 'Sponsor only sees authorized students');
      logPass(`GET /students: Sponsor restricted view correctly limited to authorized students`);

      // GET /disbursements
      const disbRes = await makeRequest(testServer, 'GET', '/disbursements', {
        Authorization: `Bearer ${adminToken}`,
      });
      assert.strictEqual(disbRes.status, 200);
      assert.ok(disbRes.body.data.budget_summary, 'Budget summary object present in response');
      logPass('GET /disbursements: Retrieved disbursements with budget summary computed from TiDB');

      // GET /schools
      const schoolRes = await makeRequest(testServer, 'GET', '/schools', {
        Authorization: `Bearer ${adminToken}`,
      });
      assert.strictEqual(schoolRes.status, 200);
      logPass(`GET /schools: Retrieved schools with status 200`);

      // RBAC rejection: Sponsor trying to create student (should return 403 Forbidden)
      const forbiddenCreate = await makeRequest(
        testServer,
        'POST',
        '/students',
        { Authorization: `Bearer ${sponsorToken}` },
        {
          full_name: 'Forbidden Student',
          date_of_birth: '2015-01-01',
          gender: 'Nam',
          phone: '0987654321',
          address: 'Test Address',
          grade: '1',
          family_condition: 'Test',
        }
      );
      assert.strictEqual(forbiddenCreate.status, 403, 'Sponsor creating student must be rejected with 403');
      logPass('RBAC enforcement: Sponsor role correctly denied permission to create student');
    });

    // 8. CRUD Persistence in TiDB
    await testSection('8. Mutation Lifecycle (Create -> Read -> Update -> Delete) in TiDB', async () => {
      const testDob = '2016-04-12';
      const testName = `TiDB Test Student ${Date.now()}`;

      // Create student via API
      const createRes = await makeRequest(
        testServer,
        'POST',
        '/students',
        { Authorization: `Bearer ${adminToken}` },
        {
          full_name: testName,
          date_of_birth: testDob,
          gender: 'Nữ',
          phone: '0912345678',
          address: 'TiDB Cloud Live Test Address, Lai Châu',
          school: 'Trường Tiểu học Bản Khoang',
          status: 'ACTIVE',
          grade: '3',
          family_condition: 'Khó khăn kiểm thử',
          sponsor_id: 1,
        }
      );

      assert.strictEqual(createRes.status, 201, 'Student creation should return 201 Created');
      const createdStudent = createRes.body.data;
      const createdId = createdStudent.id;
      assert.ok(createdId.startsWith('HS'), `New ID should have HS prefix: ${createdId}`);
      logPass(`POST /students: Successfully created student ${createdId} in TiDB`);

      // Verify persisted directly via database query
      const dbDirect = await StudentModel.findById(createdId);
      assert.ok(dbDirect, 'Created record must be directly queryable from TiDB');
      assert.strictEqual(dbDirect.full_name, testName);
      logPass(`Direct SQL query: Confirmed student ${createdId} physically stored in TiDB`);

      // Verify relation persisted in sponsor_students
      const relDirect = await SponsorStudentModel.findByStudentId(createdId);
      assert.ok(relDirect, 'Sponsor relationship must be saved in sponsor_students in TiDB');
      assert.strictEqual(relDirect.sponsor_id, 1);
      logPass(`Direct SQL query: Confirmed sponsor relationship in sponsor_students table in TiDB`);

      // Update student via API
      const updateRes = await makeRequest(
        testServer,
        'PATCH',
        `/students/${createdId}`,
        { Authorization: `Bearer ${adminToken}` },
        {
          full_name: `${testName} (Updated)`,
          family_condition: 'Đã cập nhật kiểm thử',
        }
      );
      assert.strictEqual(updateRes.status, 200, 'Student update should return 200');
      const updatedInDb = await StudentModel.findById(createdId);
      assert.strictEqual(updatedInDb.full_name, `${testName} (Updated)`);
      logPass(`PATCH /students/${createdId}: Confirmed update reflected in TiDB`);

      // Delete student via API
      const deleteRes = await makeRequest(
        testServer,
        'DELETE',
        `/students/${createdId}`,
        { Authorization: `Bearer ${adminToken}` },
        null
      );
      assert.strictEqual(deleteRes.status, 200, 'Delete student should return 200');

      // Verify removed from TiDB
      const afterDelete = await StudentModel.findById(createdId);
      assert.strictEqual(afterDelete, null, 'Deleted student must no longer exist in TiDB');
      const relAfterDelete = await SponsorStudentModel.findByStudentId(createdId);
      assert.strictEqual(relAfterDelete, null, 'Linked sponsor_students record must be cleaned up');
      logPass(`DELETE /students/${createdId}: Confirmed student and relations deleted from TiDB`);
    });

  } finally {
    await new Promise(resolve => testServer.close(resolve));
    console.log('\nTest HTTP server stopped.');
    await db.closePool();
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n==================================================');
  console.log('              TiDB Verification Summary');
  console.log('==================================================');
  console.log(`  Passed Tests : ${passedTests}`);
  console.log(`  Failed Tests : ${failedTests}`);
  console.log(`  Total Time   : ${duration}s`);
  console.log('==================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
