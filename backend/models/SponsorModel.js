const BaseModel = require('./BaseModel');
const { Sponsor } = require('./schemas');

class SponsorModel extends BaseModel {
  constructor() {
    super(
      'sponsors',
      'id',
      [
        'id',
        'account_id',
        'full_name',
        'phone',
        'gender',
        'address',
        'note',
        'is_active',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
      ],
      Sponsor
    );
  }

  async findByFullName(full_name) {
    return this.findOne({ full_name });
  }

  async findByAccountId(accountId) {
    return this.findOne({ account_id: accountId });
  }
}

const instance = new SponsorModel();
instance.Model = Sponsor;
module.exports = instance;
