const express = require('express');
const router = express.Router();
const DisbursementController = require('../controllers/DisbursementController');
const { authorize } = require('../middlewares/authorize');
const { ACTIONS, RESOURCES } = require('../data');

// CRUD Routes for Disbursements
router.get('/', authorize(ACTIONS.READ, RESOURCES.DISBURSEMENT), DisbursementController.getAllDisbursements);
router.get('/:id', authorize(ACTIONS.READ, RESOURCES.DISBURSEMENT), DisbursementController.getDisbursementById);
router.post('/', authorize(ACTIONS.CREATE, RESOURCES.DISBURSEMENT), DisbursementController.createDisbursement);
router.patch('/:id', authorize(ACTIONS.UPDATE, RESOURCES.DISBURSEMENT), DisbursementController.updateDisbursement);
router.delete('/:id', authorize(ACTIONS.UPDATE, RESOURCES.DISBURSEMENT), DisbursementController.deleteDisbursement);

module.exports = router;
