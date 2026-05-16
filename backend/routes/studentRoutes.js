const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Students
router.get('/', authorize(ACTIONS.READ, RESOURCES.STUDENT), StudentController.getAllStudents);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.STUDENT), StudentController.getStudentById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.STUDENT), StudentController.createStudent);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.STUDENT), StudentController.updateStudent);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.STUDENT), StudentController.deleteStudent);

module.exports = router;
