const SupportDisbursementModel = require('../models/SupportDisbursementModel');
const StudentModel = require('../models/StudentModel');
const SponsorModel = require('../models/SponsorModel');
const TeacherModel = require('../models/TeacherModel');
const BankTransactionModel = require('../models/BankTransactionModel');

const { validateDisbursement } = require('../validations/disbursementValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');

const { formatDisbursementResponse, parseDisbursementRequest } = require('../utils/formatDisbursement');
const { formatStudentResponse } = require('../utils/formatStudent');
const { formatSponsorResponse } = require('../utils/formatSponsor');
const { formatTeacherResponse } = require('../utils/formatTeacher');

const sponsorStudentsData = require('../data/sponsor_students');
const bankTransactionsData = require('../data/bank_transactions');

class DisbursementController {
  /**
   * GET /disbursements
   * Fetches all disbursements with joined data and budget summary per bank transaction.
   */
  async getAllDisbursements(req, res) {
    try {
      let disbursements = await SupportDisbursementModel.findAll();

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { teacherId } = getTeacherLinkedResources(req.user.id);
        disbursements = disbursements.filter(d => d.teacher_id === teacherId);
      }

      const formattedDisbursements = disbursements.map(formatDisbursementResponse);

      // Compute remaining balance per bank transaction
      const txAllocated = {};
      for (const d of disbursements) {
        if (!txAllocated[d.bank_transaction_id]) {
          txAllocated[d.bank_transaction_id] = 0;
        }
        txAllocated[d.bank_transaction_id] += d.amount;
      }

      // Build budget summary for each transaction used
      const budgetSummary = {};
      for (const txId of Object.keys(txAllocated)) {
        const tx = bankTransactionsData.find(t => t.id === parseInt(txId));
        if (tx) {
          budgetSummary[txId] = {
            transaction_code: tx.transaction_code,
            total_amount: tx.amount,
            allocated: txAllocated[txId],
            remaining: tx.amount - txAllocated[txId],
          };
        }
      }

      const paginatedResult = paginate(formattedDisbursements, req, 'disbursements');

      return sendSuccess(res, {
        ...paginatedResult,
        budget_summary: budgetSummary,
      });
    } catch (error) {
      return sendError(res, 'Failed to fetch disbursements', error.message);
    }
  }

  /**
   * GET /disbursements/:id
   * Fetches a single disbursement with full related data.
   */
  async getDisbursementById(req, res) {
    try {
      const disbursement = await SupportDisbursementModel.findById(parseInt(req.params.id));
      if (!disbursement) return sendError(res, 'Disbursement not found', [], 404);

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { teacherId } = getTeacherLinkedResources(req.user.id);
        if (disbursement.teacher_id !== teacherId) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      const formatted = formatDisbursementResponse(disbursement);

      // Fetch full student detail
      let studentObj = null;
      if (disbursement.student_id) {
        const studentRaw = await StudentModel.findById(disbursement.student_id);
        if (studentRaw) {
          studentObj = formatStudentResponse(studentRaw);
        }
      }

      // Fetch full sponsor detail via sponsor_students
      let sponsorObj = null;
      const sponsorStudentRel = sponsorStudentsData.find(ss => ss.id === disbursement.sponsor_student_id);
      if (sponsorStudentRel) {
        const sponsorRaw = await SponsorModel.findById(sponsorStudentRel.sponsor_id);
        if (sponsorRaw) {
          sponsorObj = formatSponsorResponse(sponsorRaw);
        }
      }

      // Fetch full teacher detail
      let teacherObj = null;
      if (disbursement.teacher_id) {
        const teacherRaw = await TeacherModel.findById(disbursement.teacher_id);
        if (teacherRaw) {
          teacherObj = formatTeacherResponse(teacherRaw);
        }
      }

      // Fetch bank transaction detail
      let transactionObj = null;
      if (disbursement.bank_transaction_id) {
        const txRaw = await BankTransactionModel.findById(disbursement.bank_transaction_id);
        if (txRaw) {
          transactionObj = txRaw;
        }
      }

      // Compute budget remaining for this bank transaction
      let budgetInfo = null;
      if (transactionObj) {
        const allForTx = await SupportDisbursementModel.findByBankTransactionId(disbursement.bank_transaction_id);
        const totalAllocated = allForTx.reduce((sum, d) => sum + d.amount, 0);
        budgetInfo = {
          transaction_code: transactionObj.transaction_code,
          total_amount: transactionObj.amount,
          allocated: totalAllocated,
          remaining: transactionObj.amount - totalAllocated,
        };
      }

      const responseData = {
        ...formatted,
        student: studentObj,
        sponsor: sponsorObj,
        teacher: teacherObj,
        transaction: transactionObj,
        budget: budgetInfo,
      };

      return sendSuccess(res, responseData);
    } catch (error) {
      return sendError(res, 'Failed to fetch disbursement', error.message);
    }
  }

  /**
   * POST /disbursements
   * Creates a new disbursement record.
   */
  async createDisbursement(req, res) {
    try {
      const parsedBody = parseDisbursementRequest(req.body);
      const validation = validateDisbursement(parsedBody);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      // Verify the allocation doesn't exceed the bank transaction remaining
      if (parsedBody.bank_transaction_id && parsedBody.amount) {
        const tx = bankTransactionsData.find(t => t.id === parsedBody.bank_transaction_id);
        if (tx) {
          const allForTx = await SupportDisbursementModel.findByBankTransactionId(parsedBody.bank_transaction_id);
          const totalAllocated = allForTx.reduce((sum, d) => sum + d.amount, 0);
          const remaining = tx.amount - totalAllocated;
          if (parsedBody.amount > remaining) {
            return sendError(res, `Số tiền phân bổ (${parsedBody.amount.toLocaleString('vi-VN')}đ) vượt quá số dư còn lại (${remaining.toLocaleString('vi-VN')}đ)`, [], 400);
          }
        }
      }

      const newId = await SupportDisbursementModel.generateNextId();
      const newDisbursement = await SupportDisbursementModel.create({
        id: newId,
        ...parsedBody,
        status_id: parsedBody.status_id || 1, // Default: HOLDING
        created_at: new Date(),
      });

      return sendSuccess(res, formatDisbursementResponse(newDisbursement), 'Disbursement created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create disbursement', error.message);
    }
  }

  /**
   * PATCH /disbursements/:id
   * Updates an existing disbursement record.
   */
  async updateDisbursement(req, res) {
    try {
      const parsedBody = parseDisbursementRequest(req.body);
      const validation = validateDisbursement(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const existing = await SupportDisbursementModel.findById(parseInt(req.params.id));
      if (!existing) return sendError(res, 'Disbursement not found', [], 404);

      // If amount or bank_transaction_id changed, re-validate budget
      const newAmount = parsedBody.amount !== undefined ? parsedBody.amount : existing.amount;
      const newTxId = parsedBody.bank_transaction_id !== undefined ? parsedBody.bank_transaction_id : existing.bank_transaction_id;

      if (newTxId) {
        const tx = bankTransactionsData.find(t => t.id === newTxId);
        if (tx) {
          const allForTx = await SupportDisbursementModel.findByBankTransactionId(newTxId);
          // Exclude current record from the sum
          const totalAllocated = allForTx
            .filter(d => d.id !== existing.id)
            .reduce((sum, d) => sum + d.amount, 0);
          const remaining = tx.amount - totalAllocated;
          if (newAmount > remaining) {
            return sendError(res, `Số tiền phân bổ (${newAmount.toLocaleString('vi-VN')}đ) vượt quá số dư còn lại (${remaining.toLocaleString('vi-VN')}đ)`, [], 400);
          }
        }
      }

      const updatedDisbursement = await SupportDisbursementModel.update(parseInt(req.params.id), parsedBody);
      if (!updatedDisbursement) return sendError(res, 'Disbursement not found', [], 404);

      return sendSuccess(res, formatDisbursementResponse(updatedDisbursement), 'Disbursement updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update disbursement', error.message);
    }
  }

  /**
   * DELETE /disbursements/:id
   * Deletes a disbursement record.
   */
  async deleteDisbursement(req, res) {
    try {
      const success = await SupportDisbursementModel.delete(parseInt(req.params.id));
      if (!success) return sendError(res, 'Disbursement not found', [], 404);

      return sendSuccess(res, null, 'Disbursement deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete disbursement', error.message);
    }
  }
}

module.exports = new DisbursementController();
