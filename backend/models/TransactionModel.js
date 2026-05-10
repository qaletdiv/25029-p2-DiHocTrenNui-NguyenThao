const BaseModel = require('./BaseModel');
const transactionsData = require('../data/transactions');

class TransactionModel extends BaseModel {
  constructor() {
    super(transactionsData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 'TX00000001';

    const getNumber = (str) => parseInt(str.replace(/^\D+/g, '')) || 0;
    
    const latestTransaction = this.data.reduce((max, current) => 
      getNumber(current.id) > getNumber(max.id) ? current : max
    );
    
    const idNumber = getNumber(latestTransaction.id) + 1;
    return `TX${String(idNumber).padStart(8, '0')}`;
  }
}

module.exports = new TransactionModel();
