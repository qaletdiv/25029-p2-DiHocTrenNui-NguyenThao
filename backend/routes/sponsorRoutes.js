const express = require('express');
const router = express.Router();
const SponsorController = require('../controllers/SponsorController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Sponsors
router.get('/', authorize(ACTIONS.READ, RESOURCES.SPONSOR), SponsorController.getAllSponsors);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.SPONSOR), SponsorController.getSponsorById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.SPONSOR), SponsorController.createSponsor);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.SPONSOR), SponsorController.updateSponsor);
router.delete('/:id', authorize(ACTIONS.DELETE, RESOURCES.SPONSOR), SponsorController.deleteSponsor);

module.exports = router;
