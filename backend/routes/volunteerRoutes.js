const express = require('express');
const router = express.Router();
const VolunteerController = require('../controllers/VolunteerController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Volunteers
router.get('/', authorize(ACTIONS.READ, RESOURCES.VOLUNTEER), VolunteerController.getAllVolunteers);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.VOLUNTEER), VolunteerController.getVolunteerById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.VOLUNTEER), VolunteerController.createVolunteer);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.VOLUNTEER), VolunteerController.updateVolunteer);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.VOLUNTEER), VolunteerController.deleteVolunteer);

module.exports = router;
