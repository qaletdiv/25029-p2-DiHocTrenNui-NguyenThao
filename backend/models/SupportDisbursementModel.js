const BaseModel = require('./BaseModel');
const { SupportDisbursement } = require('./schemas');

class SupportDisbursementModel extends BaseModel {
  constructor() {
    super(
      'support_disbursements',
      'id',
      [
        'id',
        'bank_transaction_id',
        'sponsor_student_id',
        'student_id',
        'teacher_id',
        'support_month',
        'support_year',
        'amount',
        'delivered_at',
        'status_id',
        'created_at',
      ],
      SupportDisbursement
    );
  }

  async findByStudentId(studentId) {
    return this.findAll({ student_id: studentId });
  }

  async findByBankTransactionId(txId) {
    return this.findAll({ bank_transaction_id: txId });
  }
}

const instance = new SupportDisbursementModel();
instance.Model = SupportDisbursement;
module.exports = instance;
