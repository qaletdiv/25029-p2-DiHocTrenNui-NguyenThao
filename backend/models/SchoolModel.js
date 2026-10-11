const BaseModel = require('./BaseModel');
const { School } = require('./schemas');

class SchoolModel extends BaseModel {
  constructor() {
    super(
      'schools',
      'id',
      [
        'id',
        'name',
        'phone',
        'email',
        'address',
        'note',
        'is_active',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
      ],
      School
    );
  }

  async findByName(name) {
    return this.findOne({ name });
  }
}

const instance = new SchoolModel();
instance.Model = School;
module.exports = instance;
