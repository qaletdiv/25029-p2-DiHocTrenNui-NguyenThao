const BaseModel = require('./BaseModel');
const { Teacher } = require('./schemas');

class TeacherModel extends BaseModel {
  constructor() {
    super(
      'teachers',
      'id',
      [
        'id',
        'account_id',
        'school_id',
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
      Teacher
    );
  }

  async findByAccountId(accountId) {
    return this.findOne({ account_id: accountId });
  }
}

const instance = new TeacherModel();
instance.Model = Teacher;
module.exports = instance;
