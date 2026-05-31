const http = require('http');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'dihoctrennui-example-secret-key-2026';

// Helper to sign token for sponsor1 (account_id 12, role_id 4)
function generateSponsorToken() {
  return jwt.sign({ id: 12, username: 'sponsor1', role_id: 4, email: 'sponsor1@gmail.com' }, SECRET_KEY, { expiresIn: '1h' });
}

// Helper to make a GET request to a path
function makeGetRequest(token, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`[GET ERROR] ${path}:`, err.message);
      resolve(null);
    });

    req.end();
  });
}

async function runTests() {
  console.log('Starting Sponsor ABAC/RBAC Verification Tests...\n');
  const token = generateSponsorToken();

  let failedTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
      failedTests++;
    }
  }

  // --- STUDENTS ---
  console.log('\n--- Testing Students Access ---');
  // List Students: should only return HS0020
  const studentsListRes = await makeGetRequest(token, '/students');
  assert(studentsListRes.statusCode === 200, 'GET /students returned 200');
  if (studentsListRes.body && studentsListRes.body.success) {
    const students = studentsListRes.body.data.students || [];
    assert(students.length === 1 && students[0].id === 'HS0020', 'GET /students lists ONLY the linked student (HS0020)');
  } else {
    assert(false, 'GET /students response matches expected format');
  }

  // Detail Student: HS0020 should succeed
  const studentDetailLinked = await makeGetRequest(token, '/students/HS0020');
  assert(studentDetailLinked.statusCode === 200, 'GET /students/HS0020 (linked) returns 200');
  assert(studentDetailLinked.body.success === true, 'GET /students/HS0020 succeeds');

  // Detail Student: HS0001 (unlinked) should fail with 403 Forbidden Access Denied
  const studentDetailUnlinked = await makeGetRequest(token, '/students/HS0001');
  assert(studentDetailUnlinked.statusCode === 403, 'GET /students/HS0001 (unlinked) returns 403');
  assert(studentDetailUnlinked.body.message === 'Access Denied', 'GET /students/HS0001 returns "Access Denied"');


  // --- SCHOOLS ---
  console.log('\n--- Testing Schools Access ---');
  // List Schools: should only return school ID 4
  const schoolsListRes = await makeGetRequest(token, '/schools');
  assert(schoolsListRes.statusCode === 200, 'GET /schools returned 200');
  if (schoolsListRes.body && schoolsListRes.body.success) {
    const schools = schoolsListRes.body.data.schools || [];
    assert(schools.length === 1 && schools[0].id === 4, 'GET /schools lists ONLY the school of the linked student (ID 4)');
  } else {
    assert(false, 'GET /schools response matches expected format');
  }

  // Detail School: School 4 (linked) should succeed
  const schoolDetailLinked = await makeGetRequest(token, '/schools/4');
  assert(schoolDetailLinked.statusCode === 200, 'GET /schools/4 (linked) returns 200');
  
  // Detail School: School 1 (unlinked) should fail with 403 Forbidden Access Denied
  const schoolDetailUnlinked = await makeGetRequest(token, '/schools/1');
  assert(schoolDetailUnlinked.statusCode === 403, 'GET /schools/1 (unlinked) returns 403');
  assert(schoolDetailUnlinked.body.message === 'Access Denied', 'GET /schools/1 returns "Access Denied"');


  // --- VOLUNTEERS ---
  console.log('\n--- Testing Volunteers Access ---');
  // List Volunteers: should only return volunteer ID 1
  const volunteersListRes = await makeGetRequest(token, '/volunteers');
  assert(volunteersListRes.statusCode === 200, 'GET /volunteers returned 200');
  if (volunteersListRes.body && volunteersListRes.body.success) {
    const volunteers = volunteersListRes.body.data.volunteers || [];
    assert(volunteers.length === 1 && volunteers[0].id === 1, 'GET /volunteers lists ONLY the volunteer of the linked student (ID 1)');
  } else {
    assert(false, 'GET /volunteers response matches expected format');
  }

  // Detail Volunteer: Volunteer 1 (linked) should succeed
  const volunteerDetailLinked = await makeGetRequest(token, '/volunteers/1');
  assert(volunteerDetailLinked.statusCode === 200, 'GET /volunteers/1 (linked) returns 200');

  // Detail Volunteer: Volunteer 2 (unlinked) should fail with 403 Forbidden Access Denied
  const volunteerDetailUnlinked = await makeGetRequest(token, '/volunteers/2');
  assert(volunteerDetailUnlinked.statusCode === 403, 'GET /volunteers/2 (unlinked) returns 403');
  assert(volunteerDetailUnlinked.body.message === 'Access Denied', 'GET /volunteers/2 returns "Access Denied"');


  // --- TEACHERS ---
  console.log('\n--- Testing Teachers Access ---');
  // List Teachers: should only return teacher ID 4
  const teachersListRes = await makeGetRequest(token, '/teachers');
  assert(teachersListRes.statusCode === 200, 'GET /teachers returned 200');
  if (teachersListRes.body && teachersListRes.body.success) {
    const teachers = teachersListRes.body.data.teachers || [];
    assert(teachers.length === 1 && teachers[0].id === 4, 'GET /teachers lists ONLY the teacher of the linked student (ID 4)');
  } else {
    assert(false, 'GET /teachers response matches expected format');
  }

  // Detail Teacher: Teacher 4 (linked) should succeed
  const teacherDetailLinked = await makeGetRequest(token, '/teachers/4');
  assert(teacherDetailLinked.statusCode === 200, 'GET /teachers/4 (linked) returns 200');

  // Detail Teacher: Teacher 1 (unlinked) should fail with 403 Forbidden Access Denied
  const teacherDetailUnlinked = await makeGetRequest(token, '/teachers/1');
  assert(teacherDetailUnlinked.statusCode === 403, 'GET /teachers/1 (unlinked) returns 403');
  assert(teacherDetailUnlinked.body.message === 'Access Denied', 'GET /teachers/1 returns "Access Denied"');


  // --- SPONSORS ---
  console.log('\n--- Testing Sponsors Access ---');
  // List Sponsors: should only return sponsor ID 1
  const sponsorsListRes = await makeGetRequest(token, '/sponsors');
  assert(sponsorsListRes.statusCode === 200, 'GET /sponsors returned 200');
  if (sponsorsListRes.body && sponsorsListRes.body.success) {
    const sponsors = sponsorsListRes.body.data.sponsors || [];
    assert(sponsors.length === 1 && sponsors[0].id === 1, 'GET /sponsors lists ONLY the sponsor\'s own profile (ID 1)');
  } else {
    assert(false, 'GET /sponsors response matches expected format');
  }

  // Detail Sponsor: Sponsor 1 (own profile) should succeed
  const sponsorDetailLinked = await makeGetRequest(token, '/sponsors/1');
  assert(sponsorDetailLinked.statusCode === 200, 'GET /sponsors/1 (own profile) returns 200');

  // Detail Sponsor: Sponsor 2 (other profile) should fail with 403 Forbidden Access Denied
  const sponsorDetailUnlinked = await makeGetRequest(token, '/sponsors/2');
  assert(sponsorDetailUnlinked.statusCode === 403, 'GET /sponsors/2 (other profile) returns 403');
  assert(sponsorDetailUnlinked.body.message === 'Access Denied', 'GET /sponsors/2 returns "Access Denied"');


  // --- BANK TRANSACTIONS ---
  console.log('\n--- Testing Bank Transactions Access ---');
  // List Bank Transactions: should only return transactions where sponsor_id === 1
  const transactionsListRes = await makeGetRequest(token, '/bank-transactions');
  assert(transactionsListRes.statusCode === 200, 'GET /bank-transactions returned 200');
  if (transactionsListRes.body && transactionsListRes.body.success) {
    const transactions = transactionsListRes.body.data.transactions || [];
    const hasOnlyOwn = transactions.every(t => t.sponsor_id === 1);
    assert(transactions.length > 0 && hasOnlyOwn, 'GET /bank-transactions lists ONLY the sponsor\'s own transactions');
  } else {
    assert(false, 'GET /bank-transactions response matches expected format');
  }

  // Detail Bank Transaction: Transaction 1 (own transaction) should succeed
  const transactionDetailLinked = await makeGetRequest(token, '/bank-transactions/1');
  assert(transactionDetailLinked.statusCode === 200, 'GET /bank-transactions/1 (own transaction) returns 200');

  // Detail Bank Transaction: Transaction 3 (unlinked transaction, sponsor_id === 2) should fail with 403 Forbidden Access Denied
  const transactionDetailUnlinked = await makeGetRequest(token, '/bank-transactions/3');
  assert(transactionDetailUnlinked.statusCode === 403, 'GET /bank-transactions/3 (unlinked transaction) returns 403');
  assert(transactionDetailUnlinked.body.message === 'Access Denied', 'GET /bank-transactions/3 returns "Access Denied"');


  console.log(`\nTest Summary: ${passedTests} passed, ${failedTests} failed.`);
  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('All Sponsor ABAC/RBAC Access Control tests passed successfully!');
    process.exit(0);
  }
}

runTests();
