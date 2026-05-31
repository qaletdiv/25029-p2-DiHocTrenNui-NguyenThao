const BaseModel = require('./BaseModel');
const supportDisbursementsData = require('../data/support_disbursements');

class SupportDisbursementModel extends BaseModel {
  constructor() {
    super(supportDisbursementsData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 1;
    const maxId = Math.max(...this.data.map(d => d.id));
    return maxId + 1;
  }

  async findByStudentId(studentId) {
    return this.data.filter(d => d.student_id === studentId);
  }

  async findByBankTransactionId(txId) {
    return this.data.filter(d => d.bank_transaction_id === txId);
  }
}

module.exports = new SupportDisbursementModel();
