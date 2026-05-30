const http = require('http');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'dihoctrennui-example-secret-key-2026';
const PORT = 5001;

// Helper to sign tokens
function generateToken(accountId, username, roleId) {
  return jwt.sign({ id: accountId, username, role_id: roleId, email: `${username}@gmail.com` }, SECRET_KEY, { expiresIn: '1h' });
}

// Helper to make a GET request to a path
function makeGetRequest(token, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
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
  console.log('Starting Volunteer ABAC/RBAC Verification Tests...\n');

  // volunteer1 account has ID 2, role_id 2 (VOLUNTEER), maps to volunteer_id 1
  const tokenV1 = generateToken(2, 'volunteer1', 2);

  // volunteer6 account has ID 99 (Test Unlinked Volunteer), role_id 2 (VOLUNTEER), maps to volunteer_id 6 (has no linked students)
  const tokenV6 = generateToken(99, 'volunteer6', 2);

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
  console.log('\n--- Testing Students Access (As Volunteer 1: Linked) ---');
  // List Students: should return linked students (including HS0005), but not HS0001
  const studentsListRes = await makeGetRequest(tokenV1, '/students');
  assert(studentsListRes.statusCode === 200, 'GET /students returned 200');
  if (studentsListRes.body && studentsListRes.body.success) {
    const students = studentsListRes.body.data.students || [];
    const ids = students.map(s => s.id);
    assert(ids.includes('HS0005'), 'GET /students lists the linked student HS0005');
    assert(!ids.includes('HS0001'), 'GET /students does NOT list unlinked student HS0001');
  } else {
    assert(false, 'GET /students response matches expected format');
  }

  // Detail Student: HS0005 (linked) should succeed
  const studentDetailLinked = await makeGetRequest(tokenV1, '/students/HS0005');
  assert(studentDetailLinked.statusCode === 200, 'GET /students/HS0005 (linked) returns 200');

  // Detail Student: HS0001 (unlinked) should fail with 403 Forbidden Access Denied
  const studentDetailUnlinked = await makeGetRequest(tokenV1, '/students/HS0001');
  assert(studentDetailUnlinked.statusCode === 403, 'GET /students/HS0001 (unlinked) returns 403');
  assert(studentDetailUnlinked.body.message === 'Access Denied', 'GET /students/HS0001 returns "Access Denied"');

  console.log('\n--- Testing Students Access (As Volunteer 6: Unlinked) ---');
  // List Students: should be empty for unlinked volunteer
  const studentsListResV6 = await makeGetRequest(tokenV6, '/students');
  assert(studentsListResV6.statusCode === 200, 'GET /students (unlinked volunteer) returned 200');
  if (studentsListResV6.body && studentsListResV6.body.success) {
    const students = studentsListResV6.body.data.students || [];
    assert(students.length === 0, 'GET /students lists 0 students for volunteer with no links');
  } else {
    assert(false, 'GET /students response matches expected format');
  }

  // Detail Student: HS0005 (unlinked for V6) should fail with 403 Forbidden
  const studentDetailUnlinkedV6 = await makeGetRequest(tokenV6, '/students/HS0005');
  assert(studentDetailUnlinkedV6.statusCode === 403, 'GET /students/HS0005 (unlinked for V6) returns 403');


  // --- SCHOOLS ---
  console.log('\n--- Testing Schools Access (As Volunteer 1: Linked) ---');
  // List Schools: school 1 should be visible
  const schoolsListRes = await makeGetRequest(tokenV1, '/schools');
  assert(schoolsListRes.statusCode === 200, 'GET /schools returned 200');
  if (schoolsListRes.body && schoolsListRes.body.success) {
    const schools = schoolsListRes.body.data.schools || [];
    const ids = schools.map(s => s.id);
    assert(ids.includes(1), 'GET /schools lists the school (ID 1) of the linked student');
  } else {
    assert(false, 'GET /schools response matches expected format');
  }

  // Detail School: School 1 should succeed
  const schoolDetailLinked = await makeGetRequest(tokenV1, '/schools/1');
  assert(schoolDetailLinked.statusCode === 200, 'GET /schools/1 (linked) returns 200');

  console.log('\n--- Testing Schools Access (As Volunteer 6: Unlinked) ---');
  // List Schools: should be empty for unlinked volunteer
  const schoolsListResV6 = await makeGetRequest(tokenV6, '/schools');
  assert(schoolsListResV6.statusCode === 200, 'GET /schools (unlinked volunteer) returned 200');
  if (schoolsListResV6.body && schoolsListResV6.body.success) {
    const schools = schoolsListResV6.body.data.schools || [];
    assert(schools.length === 0, 'GET /schools lists 0 schools for volunteer with no links');
  }

  // Detail School: School 1 (unlinked for V6) should fail with 403 Forbidden
  const schoolDetailUnlinkedV6 = await makeGetRequest(tokenV6, '/schools/1');
  assert(schoolDetailUnlinkedV6.statusCode === 403, 'GET /schools/1 (unlinked for V6) returns 403');
  assert(schoolDetailUnlinkedV6.body.message === 'Access Denied', 'GET /schools/1 returns "Access Denied"');


  // --- TEACHERS ---
  console.log('\n--- Testing Teachers Access (As Volunteer 1: Linked) ---');
  // List Teachers: teacher 1 should be visible
  const teachersListRes = await makeGetRequest(tokenV1, '/teachers');
  assert(teachersListRes.statusCode === 200, 'GET /teachers returned 200');
  if (teachersListRes.body && teachersListRes.body.success) {
    const teachers = teachersListRes.body.data.teachers || [];
    const ids = teachers.map(t => t.id);
    assert(ids.includes(1), 'GET /teachers lists the teacher (ID 1) of the linked student');
  }

  // Detail Teacher: Teacher 1 should succeed
  const teacherDetailLinked = await makeGetRequest(tokenV1, '/teachers/1');
  assert(teacherDetailLinked.statusCode === 200, 'GET /teachers/1 (linked) returns 200');

  console.log('\n--- Testing Teachers Access (As Volunteer 6: Unlinked) ---');
  // List Teachers: should be empty for unlinked volunteer
  const teachersListResV6 = await makeGetRequest(tokenV6, '/teachers');
  assert(teachersListResV6.statusCode === 200, 'GET /teachers (unlinked volunteer) returned 200');
  if (teachersListResV6.body && teachersListResV6.body.success) {
    const teachers = teachersListResV6.body.data.teachers || [];
    assert(teachers.length === 0, 'GET /teachers lists 0 teachers for volunteer with no links');
  }

  // Detail Teacher: Teacher 1 (unlinked for V6) should fail with 403 Forbidden
  const teacherDetailUnlinkedV6 = await makeGetRequest(tokenV6, '/teachers/1');
  assert(teacherDetailUnlinkedV6.statusCode === 403, 'GET /teachers/1 (unlinked for V6) returns 403');
  assert(teacherDetailUnlinkedV6.body.message === 'Access Denied', 'GET /teachers/1 returns "Access Denied"');


  // --- SPONSORS ---
  console.log('\n--- Testing Sponsors Access (As Volunteer 1: Linked) ---');
  // List Sponsors: sponsor 1 (linked to HS0020) should be visible, sponsor 2 (linked to HS0001 only) should NOT
  const sponsorsListRes = await makeGetRequest(tokenV1, '/sponsors');
  assert(sponsorsListRes.statusCode === 200, 'GET /sponsors returned 200');
  if (sponsorsListRes.body && sponsorsListRes.body.success) {
    const sponsors = sponsorsListRes.body.data.sponsors || [];
    const ids = sponsors.map(s => s.id);
    assert(ids.includes(1), 'GET /sponsors lists linked sponsor (ID 1)');
    assert(!ids.includes(2), 'GET /sponsors does NOT list unlinked sponsor (ID 2)');
  }

  // Detail Sponsor: Sponsor 1 should succeed
  const sponsorDetailLinked = await makeGetRequest(tokenV1, '/sponsors/1');
  assert(sponsorDetailLinked.statusCode === 200, 'GET /sponsors/1 (linked) returns 200');

  // Detail Sponsor: Sponsor 2 (unlinked) should fail with 403 Forbidden
  const sponsorDetailUnlinked = await makeGetRequest(tokenV1, '/sponsors/2');
  assert(sponsorDetailUnlinked.statusCode === 403, 'GET /sponsors/2 (unlinked) returns 403');
  assert(sponsorDetailUnlinked.body.message === 'Access Denied', 'GET /sponsors/2 returns "Access Denied"');


  // --- VOLUNTEERS ---
  console.log('\n--- Testing Volunteers Access (As Volunteer 1) ---');
  // List Volunteers: should only return Volunteer 1's own profile
  const volunteersListRes = await makeGetRequest(tokenV1, '/volunteers');
  assert(volunteersListRes.statusCode === 200, 'GET /volunteers returned 200');
  if (volunteersListRes.body && volunteersListRes.body.success) {
    const volunteers = volunteersListRes.body.data.volunteers || [];
    assert(volunteers.length === 1 && volunteers[0].id === 1, 'GET /volunteers lists ONLY the volunteer\'s own profile (ID 1)');
  }

  // Detail Volunteer: Volunteer 1 (own profile) should succeed
  const volunteerDetailLinked = await makeGetRequest(tokenV1, '/volunteers/1');
  assert(volunteerDetailLinked.statusCode === 200, 'GET /volunteers/1 (own profile) returns 200');

  // Detail Volunteer: Volunteer 2 (other profile) should fail with 403 Forbidden Access Denied
  const volunteerDetailUnlinked = await makeGetRequest(tokenV1, '/volunteers/2');
  assert(volunteerDetailUnlinked.statusCode === 403, 'GET /volunteers/2 (other profile) returns 403');
  assert(volunteerDetailUnlinked.body.message === 'Access Denied', 'GET /volunteers/2 returns "Access Denied"');


  console.log(`\nTest Summary: ${passedTests} passed, ${failedTests} failed.`);
  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('All Volunteer ABAC/RBAC Access Control tests passed successfully!');
    process.exit(0);
  }
}

runTests();
