const BaseModel = require('./BaseModel');
const { Account } = require('./schemas');

class AccountModel extends BaseModel {
  constructor() {
    super('accounts', 'id', ['id', 'username', 'password', 'email', 'role_id', 'is_active'], Account);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async findByUsername(username) {
    return this.findOne({ username });
  }
}

const instance = new AccountModel();
instance.Model = Account;
module.exports = instance;
