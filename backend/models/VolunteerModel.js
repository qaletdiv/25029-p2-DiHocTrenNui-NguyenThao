const BaseModel = require('./BaseModel');
const { Volunteer } = require('./schemas');

class VolunteerModel extends BaseModel {
  constructor() {
    super(
      'volunteers',
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
      Volunteer
    );
  }

  async findByAccountId(accountId) {
    return this.findOne({ account_id: accountId });
  }
}

const instance = new VolunteerModel();
instance.Model = Volunteer;
module.exports = instance;
