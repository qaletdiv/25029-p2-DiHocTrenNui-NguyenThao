const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/TeacherController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Teachers
router.get('/', authorize(ACTIONS.READ, RESOURCES.TEACHER), TeacherController.getAllTeachers);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.TEACHER), TeacherController.getTeacherById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.TEACHER), TeacherController.createTeacher);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.TEACHER), TeacherController.updateTeacher);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.TEACHER), TeacherController.deleteTeacher);

module.exports = router;
