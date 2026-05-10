const express = require('express');
const router = express.Router();
const SchoolController = require('../controllers/SchoolController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Schools
router.get('/', authorize(ACTIONS.READ, RESOURCES.SCHOOL), SchoolController.getAllSchools);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.SCHOOL), SchoolController.getSchoolById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.SCHOOL), SchoolController.createSchool);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.SCHOOL), SchoolController.updateSchool);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.SCHOOL), SchoolController.deleteSchool);

module.exports = router;
