const BaseModel = require('./BaseModel');
const accountsData = require('../data/accounts');

class AccountModel extends BaseModel {
  constructor() {
    super(accountsData);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async findByUsername(username) {
    return this.findOne({ username });
  }

  /**
   * Helper to generate a new account ID (integer)
   */
  async generateNextId() {
    if (this.data.length === 0) return 1;
    const maxId = Math.max(...this.data.map(a => a.id));
    return maxId + 1;
  }
}

module.exports = new AccountModel();
