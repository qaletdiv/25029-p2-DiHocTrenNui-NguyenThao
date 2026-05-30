const http = require('http');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'dihoctrennui-example-secret-key-2026';
const PORT = 5001;

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function makeRequest(method, path, token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
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
      console.error(`[ERROR] Request to ${path} failed:`, err.message);
      resolve(null);
    });

    req.end();
  });
}

async function runTests() {
  console.log('Starting Teacher RBAC/ABAC Validation Tests...\n');

  // teacher1 account has ID 7, role_id 3 (TEACHER), maps to teacher_id 1
  const token = generateToken({ id: 7, username: 'teacher1', role_id: 3, email: 'teacher1@gmail.com' });

  let allPassed = true;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
    } else {
      console.error(`  [FAIL] ${message}`);
      allPassed = false;
    }
  }

  // Test Case 1: Student retrieval (linked vs unlinked)
  console.log('--- Test Case 1: Students ---');
  const studentList = await makeRequest('GET', '/students', token);
  assert(studentList.statusCode === 200, 'List Students status is 200');
  if (studentList.body && studentList.body.data && studentList.body.data.students) {
    const ids = studentList.body.data.students.map(s => s.id);
    assert(ids.includes('HS0001'), 'List includes linked student HS0001');
    assert(!ids.includes('HS0007'), 'List does NOT include unlinked student HS0007');
  }

  const linkedStudent = await makeRequest('GET', '/students/HS0001', token);
  assert(linkedStudent.statusCode === 200, 'Get linked Student (HS0001) status is 200');

  const unlinkedStudent = await makeRequest('GET', '/students/HS0007', token);
  assert(unlinkedStudent.statusCode === 403, 'Get unlinked Student (HS0007) status is 403');
  assert(unlinkedStudent.body.message === 'Access Denied', 'Get unlinked Student returns "Access Denied" message');

  // Test Case 2: School retrieval (linked vs unlinked)
  console.log('\n--- Test Case 2: Schools ---');
  const schoolList = await makeRequest('GET', '/schools', token);
  assert(schoolList.statusCode === 200, 'List Schools status is 200');
  if (schoolList.body && schoolList.body.data && schoolList.body.data.schools) {
    const ids = schoolList.body.data.schools.map(s => s.id);
    assert(ids.includes(1), 'List includes linked school 1');
    assert(!ids.includes(2), 'List does NOT include unlinked school 2');
  }

  const linkedSchool = await makeRequest('GET', '/schools/1', token);
  assert(linkedSchool.statusCode === 200, 'Get linked School (ID 1) status is 200');

  const unlinkedSchool = await makeRequest('GET', '/schools/2', token);
  assert(unlinkedSchool.statusCode === 403, 'Get unlinked School (ID 2) status is 403');
  assert(unlinkedSchool.body.message === 'Access Denied', 'Get unlinked School returns "Access Denied"');

  // Test Case 3: Volunteer retrieval (linked vs unlinked)
  console.log('\n--- Test Case 3: Volunteers ---');
  const volunteerList = await makeRequest('GET', '/volunteers', token);
  assert(volunteerList.statusCode === 200, 'List Volunteers status is 200');
  if (volunteerList.body && volunteerList.body.data && volunteerList.body.data.volunteers) {
    const ids = volunteerList.body.data.volunteers.map(v => v.id);
    assert(ids.includes(1), 'List includes linked volunteer 1');
    assert(!ids.includes(6), 'List does NOT include unlinked volunteer 6');
  }

  const linkedVolunteer = await makeRequest('GET', '/volunteers/1', token);
  assert(linkedVolunteer.statusCode === 200, 'Get linked Volunteer (ID 1) status is 200');

  const unlinkedVolunteer = await makeRequest('GET', '/volunteers/6', token);
  assert(unlinkedVolunteer.statusCode === 403, 'Get unlinked Volunteer (ID 6) status is 403');
  assert(unlinkedVolunteer.body.message === 'Access Denied', 'Get unlinked Volunteer returns "Access Denied"');

  // Test Case 4: Sponsor retrieval (linked vs unlinked)
  console.log('\n--- Test Case 4: Sponsors ---');
  const sponsorList = await makeRequest('GET', '/sponsors', token);
  assert(sponsorList.statusCode === 200, 'List Sponsors status is 200');
  if (sponsorList.body && sponsorList.body.data && sponsorList.body.data.sponsors) {
    const ids = sponsorList.body.data.sponsors.map(s => s.id);
    assert(ids.includes(2), 'List includes linked sponsor 2');
    assert(!ids.includes(1), 'List does NOT include unlinked sponsor 1');
  }

  const linkedSponsor = await makeRequest('GET', '/sponsors/2', token);
  assert(linkedSponsor.statusCode === 200, 'Get linked Sponsor (ID 2) status is 200');

  const unlinkedSponsor = await makeRequest('GET', '/sponsors/1', token);
  assert(unlinkedSponsor.statusCode === 403, 'Get unlinked Sponsor (ID 1) status is 403');
  assert(unlinkedSponsor.body.message === 'Access Denied', 'Get unlinked Sponsor returns "Access Denied"');

  // Test Case 5: Teacher retrieval (own vs other)
  console.log('\n--- Test Case 5: Teachers ---');
  const teacherList = await makeRequest('GET', '/teachers', token);
  assert(teacherList.statusCode === 200, 'List Teachers status is 200');
  if (teacherList.body && teacherList.body.data && teacherList.body.data.teachers) {
    const ids = teacherList.body.data.teachers.map(t => t.id);
    assert(ids.includes(1), 'List includes own teacher profile (ID 1)');
    assert(!ids.includes(2), 'List does NOT include other teacher profile (ID 2)');
  }

  const ownTeacher = await makeRequest('GET', '/teachers/1', token);
  assert(ownTeacher.statusCode === 200, 'Get own Teacher profile (ID 1) status is 200');

  const otherTeacher = await makeRequest('GET', '/teachers/2', token);
  assert(otherTeacher.statusCode === 403, 'Get other Teacher profile (ID 2) status is 403');
  assert(otherTeacher.body.message === 'Access Denied', 'Get other Teacher returns "Access Denied"');

  // Test Case 6: Disbursements/Allocations (own vs other)
  console.log('\n--- Test Case 6: Disbursements/Allocations ---');
  const disbursementList = await makeRequest('GET', '/disbursements', token);
  assert(disbursementList.statusCode === 200, 'List Disbursements status is 200');
  if (disbursementList.body && disbursementList.body.data && disbursementList.body.data.disbursements) {
    const ids = disbursementList.body.data.disbursements.map(d => d.id);
    assert(ids.includes(1), 'List includes own disbursement 1');
    assert(!ids.includes(2), 'List does NOT include other disbursement 2');
  }

  const ownDisbursement = await makeRequest('GET', '/disbursements/1', token);
  assert(ownDisbursement.statusCode === 200, 'Get own Disbursement (ID 1) status is 200');

  const otherDisbursement = await makeRequest('GET', '/disbursements/2', token);
  assert(otherDisbursement.statusCode === 403, 'Get other Disbursement (ID 2) status is 403');
  assert(otherDisbursement.body.message === 'Access Denied', 'Get other Disbursement returns "Access Denied"');

  console.log('\n--------------------------------------------------');
  if (allPassed) {
    console.log('SUCCESS: All Teacher RBAC/ABAC tests passed!');
  } else {
    console.error('FAILURE: Some Teacher RBAC/ABAC tests failed.');
  }
  console.log('--------------------------------------------------');
}

runTests();
