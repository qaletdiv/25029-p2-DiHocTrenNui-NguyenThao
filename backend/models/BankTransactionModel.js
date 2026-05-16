const BaseModel = require('./BaseModel');
const bankTransactionsData = require('../data/bank_transactions');

class BankTransactionModel extends BaseModel {
  constructor() {
    super(bankTransactionsData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 1;
    const maxId = Math.max(...this.data.map(t => t.id));
    return maxId + 1;
  }
}

module.exports = new BankTransactionModel();
