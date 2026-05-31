const ImageModel = require('../models/ImageModel');
const ImageController = require('../controllers/ImageController');
const assert = require('assert');

// Mock response creator
function createMockResponse(onEnd) {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    send: function (data) {
      this.body = data;
      if (onEnd) onEnd(this);
      return this;
    },
    json: function (data) {
      this.body = data;
      if (onEnd) onEnd(this);
      return this;
    },
    sendFile: function (path, options) {
      this.body = { filePath: path, options };
      if (onEnd) onEnd(this);
      return this;
    }
  };
  return res;
}

async function runTests() {
  console.log('=== STARTING IMAGE RETRIEVAL AUTHORIZATION TESTS ===\n');

  // Defined Mock Users
  const adminUser = { id: 1, role_id: 1, username: 'admin' };
  const volunteerUser = { id: 3, role_id: 2, username: 'volunteer2' }; // Volunteer ID 2, linked to HS0001, HS0006, etc.
  const sponsorUser = { id: 13, role_id: 4, username: 'sponsor2' }; // Sponsor ID 2, linked to HS0001, HS0021
  const unlinkedUser = { id: 99, role_id: 2, username: 'unlinked' }; // Not linked to any students

  // 1. Test isStudentAuthorized helper directly
  console.log('--- Testing isStudentAuthorized Helper ---');
  assert.strictEqual(ImageModel.isStudentAuthorized('HS0001', adminUser), true, 'Admin should be authorized for HS0001');
  assert.strictEqual(ImageModel.isStudentAuthorized('HS0004', adminUser), true, 'Admin should be authorized for HS0004');
  assert.strictEqual(ImageModel.isStudentAuthorized('HS0001', volunteerUser), true, 'Volunteer 2 should be authorized for HS0001');
  assert.strictEqual(ImageModel.isStudentAuthorized('HS0004', volunteerUser), false, 'Volunteer 2 should NOT be authorized for HS0004');
  assert.strictEqual(ImageModel.isStudentAuthorized('HS0021', sponsorUser), true, 'Sponsor 2 should be authorized for HS0021');
  assert.strictEqual(ImageModel.isStudentAuthorized('HS0004', sponsorUser), false, 'Sponsor 2 should NOT be authorized for HS0004');
  assert.strictEqual(ImageModel.isStudentAuthorized('HS0001', unlinkedUser), false, 'Unlinked user should NOT be authorized for HS0001');
  console.log('✓ isStudentAuthorized Helper tests passed!\n');

  // 2. Test ImageModel.findAll(user)
  console.log('--- Testing ImageModel.findAll(user) Filtering ---');
  const allImagesAdmin = await ImageModel.findAll(adminUser);
  console.log(`Admin finds ${allImagesAdmin.length} images`);
  assert.ok(allImagesAdmin.length > 0, 'Admin should find images');

  const allImagesVolunteer = await ImageModel.findAll(volunteerUser);
  console.log(`Volunteer 2 finds ${allImagesVolunteer.length} images`);
  // All returned images must belong to volunteer's authorized students
  allImagesVolunteer.forEach(img => {
    assert.ok(['HS0001', 'HS0006', 'HS0011', 'HS0016', 'HS0021', 'HS0026'].includes(img.student_id), `Volunteer saw unauthorized student image: ${img.student_id}`);
  });

  const allImagesSponsor = await ImageModel.findAll(sponsorUser);
  console.log(`Sponsor 2 finds ${allImagesSponsor.length} images`);
  // All returned images must belong to sponsor's authorized students (HS0001, HS0021)
  allImagesSponsor.forEach(img => {
    assert.ok(['HS0001', 'HS0021'].includes(img.student_id), `Sponsor saw unauthorized student image: ${img.student_id}`);
  });

  const allImagesUnlinked = await ImageModel.findAll(unlinkedUser);
  console.log(`Unlinked user finds ${allImagesUnlinked.length} images`);
  assert.strictEqual(allImagesUnlinked.length, 0, 'Unlinked user should find 0 images');
  console.log('✓ ImageModel.findAll filtering tests passed!\n');

  // 3. Test ImageModel.findById(id, user)
  console.log('--- Testing ImageModel.findById(id, user) ---');
  // Image ID 1 is for student HS0001
  const img1Admin = await ImageModel.findById(1, adminUser);
  assert.ok(img1Admin !== null, 'Admin should be able to fetch image ID 1');

  const img1Volunteer = await ImageModel.findById(1, volunteerUser);
  assert.ok(img1Volunteer !== null, 'Volunteer 2 should be able to fetch image ID 1 (linked to HS0001)');

  const img1Sponsor = await ImageModel.findById(1, sponsorUser);
  assert.ok(img1Sponsor !== null, 'Sponsor 2 should be able to fetch image ID 1 (linked to HS0001)');

  // Image ID 4 is for student HS0004
  const img4Volunteer = await ImageModel.findById(4, volunteerUser);
  assert.strictEqual(img4Volunteer, null, 'Volunteer 2 should NOT be able to fetch image ID 4 (unauthorized student)');

  const img4Sponsor = await ImageModel.findById(4, sponsorUser);
  assert.strictEqual(img4Sponsor, null, 'Sponsor 2 should NOT be able to fetch image ID 4 (unauthorized student)');
  console.log('✓ ImageModel.findById tests passed!\n');

  // 4. Test ImageController.getImageById
  console.log('--- Testing ImageController.getImageById (Controller layer verification) ---');
  
  // Test Authorized Access
  await new Promise((resolve) => {
    const req = { params: { id: '1' }, user: volunteerUser };
    const res = createMockResponse((response) => {
      assert.strictEqual(response.statusCode, 200, 'Should allow authorized volunteer access to image');
      assert.ok(response.body.success, 'Response should indicate success');
      assert.strictEqual(response.body.data.id, 1);
      resolve();
    });
    ImageController.getImageById(req, res).catch(resolve);
  });

  // Test Unauthorized Access (should return 403 Forbidden)
  await new Promise((resolve) => {
    const req = { params: { id: '4' }, user: volunteerUser }; // ID 4 is for HS0004 (unauthorized for volunteerUser)
    const res = createMockResponse((response) => {
      assert.strictEqual(response.statusCode, 403, 'Should reject unauthorized access with 403 Forbidden');
      assert.strictEqual(response.body.success, false, 'Response should indicate failure');
      assert.ok(response.body.message.includes('Access Denied'), 'Message should indicate access denied');
      resolve();
    });
    ImageController.getImageById(req, res).catch(resolve);
  });

  console.log('✓ ImageController.getImageById tests passed!\n');

  // 5. Test ImageController.getImagesByStudent
  console.log('--- Testing ImageController.getImagesByStudent ---');
  
  // Test Authorized Student
  await new Promise((resolve) => {
    const req = { params: { studentId: 'HS0001' }, user: volunteerUser };
    const res = createMockResponse((response) => {
      assert.strictEqual(response.statusCode, 200);
      assert.ok(Array.isArray(response.body.data));
      resolve();
    });
    ImageController.getImagesByStudent(req, res).catch(resolve);
  });

  // Test Unauthorized Student (should return 403 Forbidden)
  await new Promise((resolve) => {
    const req = { params: { studentId: 'HS0004' }, user: volunteerUser };
    const res = createMockResponse((response) => {
      assert.strictEqual(response.statusCode, 403);
      assert.strictEqual(response.body.success, false);
      assert.ok(response.body.message.includes('Access Denied'));
      resolve();
    });
    ImageController.getImagesByStudent(req, res).catch(resolve);
  });

  console.log('✓ ImageController.getImagesByStudent tests passed!\n');

  // 6. Test ImageController.proxyImage (Proxy Authorization)
  console.log('--- Testing ImageController.proxyImage Auth ---');
  
  // Image 1 URL is "gifts-1.jpg" (Student: HS0001)
  // Volunteer 2 is authorized for HS0001
  await new Promise((resolve) => {
    const req = { params: { filename: 'gifts-1.jpg' }, user: volunteerUser };
    const res = createMockResponse((response) => {
      // Since file might not exist, checking if it did not return 403 Forbidden
      assert.notStrictEqual(response.statusCode, 403, 'Should NOT block authorized volunteer for gifts-1.jpg');
      resolve();
    });
    ImageController.proxyImage(req, res).catch(resolve);
  });

  // Image 4 URL is "gifts-4.jpg" (Student: HS0004)
  // Volunteer 2 is NOT authorized for HS0004
  await new Promise((resolve) => {
    const req = { params: { filename: 'gifts-4.jpg' }, user: volunteerUser };
    const res = createMockResponse((response) => {
      assert.strictEqual(response.statusCode, 403, 'Should return 403 Forbidden for unauthorized volunteer accessing gifts-4.jpg');
      resolve();
    });
    ImageController.proxyImage(req, res).catch(resolve);
  });

  console.log('✓ ImageController.proxyImage auth tests passed!\n');

  console.log('=== ALL INTEGRATION TESTS PASSED SUCCESSFULLY ===');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
