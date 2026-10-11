const BaseModel = require('./BaseModel');
const { BankTransaction } = require('./schemas');

class BankTransactionModel extends BaseModel {
  constructor() {
    super(
      'bank_transactions',
      'id',
      [
        'id',
        'sponsor_id',
        'transaction_code',
        'bank_name',
        'account_number',
        'transfer_date',
        'amount',
        'transfer_content',
        'status_id',
        'verified_by',
        'verified_at',
        'created_at',
      ],
      BankTransaction
    );
  }

  async findByTransactionCode(code) {
    return this.findOne({ transaction_code: code });
  }

  async findBySponsorId(sponsorId) {
    return this.findAll({ sponsor_id: sponsorId });
  }
}

const instance = new BankTransactionModel();
instance.Model = BankTransaction;
module.exports = instance;
