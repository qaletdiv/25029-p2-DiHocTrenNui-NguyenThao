const http = require('http');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'dihoctrennui-example-secret-key-2026';
const BASE_URL = 'http://localhost:5001';

// Helper to sign token
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

// Helper to make POST request to /students (requires STUDENT_CREATE permission)
function makePostRequest(token, description) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      full_name: "RBAC Test Student " + Date.now(),
      date_of_birth: "2015-03-01",
      gender: "Male",
      address: "Bản Nà Lốc, Xã Nùng Nàng, Lai Châu",
      school: "Tiểu Học Nùng Nàng",
      status: "ACTIVE",
      family_condition: "Gia đình khó khăn"
    });

    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/students',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          console.log(`[TEST] ${description}`);
          console.log(`  Status Code: ${res.statusCode}`);
          console.log(`  Message:     ${parsed.message}`);
          console.log(`  Success:     ${parsed.success}`);
          console.log('--------------------------------------------------');
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          console.log(`[TEST] ${description}`);
          console.log(`  Status Code: ${res.statusCode}`);
          console.log(`  Raw Response: ${responseBody}`);
          console.log('--------------------------------------------------');
          resolve({ statusCode: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`[TEST ERROR] ${description}:`, err.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('Starting RBAC Verification Tests...\n');

  // Test Case 1: No role_id in token payload
  const tokenNoRole = generateToken({ id: 999, username: 'norole', email: 'norole@example.com' });
  await makePostRequest(tokenNoRole, 'Request with token having NO role_id');

  // Test Case 2: Invalid role_id in token payload (e.g. role_id = 999)
  const tokenInvalidRole = generateToken({ id: 999, username: 'invalidrole', role_id: 999, email: 'invalidrole@example.com' });
  await makePostRequest(tokenInvalidRole, 'Request with token having INVALID role_id (999)');

  // Test Case 3: Role without permission (e.g., Sponsor role trying to create student)
  // Sponsor role is ID 4. From role_permission.js, it doesn't have STUDENT_CREATE (permission 1).
  const tokenSponsor = generateToken({ id: 999, username: 'sponsor_user', role_id: 4, email: 'sponsor@example.com' });
  await makePostRequest(tokenSponsor, 'Request with Sponsor role trying to CREATE student (should fail)');

  // Test Case 4: Role with permission (e.g., Admin role trying to create student)
  // Admin role is ID 1. Has all permissions.
  const tokenAdmin = generateToken({ id: 1, username: 'admin', role_id: 1, email: 'admin@example.com' });
  await makePostRequest(tokenAdmin, 'Request with Admin role trying to CREATE student (should succeed)');
}

runTests();
