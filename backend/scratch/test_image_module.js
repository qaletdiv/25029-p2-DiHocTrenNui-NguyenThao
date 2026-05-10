const ImageModel = require('../models/ImageModel');
const ImageController = require('../controllers/ImageController');

async function testModule() {
  console.log('--- Testing Images Module ---');

  // 1. Test Model findAll
  const allImages = await ImageModel.findAll();
  console.log(`\nModel findAll: Found ${allImages.length} images`);

  // 2. Test Optimized Model Search
  const studentImages = await ImageModel.findByStudentId('DH92.001');
  console.log(`Model findByStudentId(DH92.001): Found ${studentImages.length} images`);

  const rangeImages = await ImageModel.findByTimeRange('2025-01-01', '2025-06-30');
  console.log(`Model findByTimeRange: Found ${rangeImages.length} images`);

  // 3. Test Model Create/Refresh
  const newId = await ImageModel.generateNextId();
  const newImage = await ImageModel.create({
    id: newId,
    student_id: 'DH92.TEST',
    url: '/test.jpg',
    timestamp: '2026-01-01T00:00:00Z'
  });
  console.log(`Model create: Created image ID ${newImage.id}`);

  const testSearch = await ImageModel.findByStudentId('DH92.TEST');
  console.log(`Search after create: Found ${testSearch.length} images for test student`);

  // 4. Test Controller (Mocking Response)
  const mockRes = {
    status: (code) => ({
      json: (data) => console.log(`Controller Response [${code}]:`, data.success ? 'Success' : 'Error')
    }),
    json: (data) => console.log(`Controller Response:`, data.success ? 'Success' : 'Error')
  };

  console.log('\nTesting Controller getAllImages:');
  await ImageController.getAllImages({}, mockRes);

  console.log('\nTesting Controller getImagesByRange (Valid Query):');
  await ImageController.getImagesByRange({ query: { start: '2025-01-01', end: '2025-12-31' } }, mockRes);

  console.log('\nTesting Controller getImagesByRange (Invalid Query):');
  await ImageController.getImagesByRange({ query: {} }, mockRes);
}

testModule().catch(console.error);
