const BaseModel = require('./BaseModel');
const { Student } = require('./schemas');

class StudentModel extends BaseModel {
  constructor() {
    super(
      'students',
      'id',
      [
        'id',
        'full_name',
        'date_of_birth',
        'gender',
        'phone',
        'address',
        'school_id',
        'grade',
        'family_condition',
        'status_id',
        'monthly_amount',
        'avatar_url',
        'is_active',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
      ],
      Student
    );
  }

  /**
   * Helper to generate next student ID (e.g. HS0001, HS0031) via Sequelize
   */
  async generateNextId() {
    const prefix = 'HS';
    const latest = await this.model.findOne({
      where: { id: { [this.Op.like]: 'HS%' } },
      order: [
        [this.sequelize.fn('LENGTH', this.sequelize.col('id')), 'DESC'],
        ['id', 'DESC'],
      ],
      raw: true,
    });

    if (!latest) {
      return 'HS0001';
    }

    const latestId = latest.id;
    const num = parseInt(latestId.replace(prefix, ''), 10) || 0;
    const nextNum = num + 1;
    return `${prefix}${String(nextNum).padStart(4, '0')}`;
  }

  /**
   * Check for duplicate student record via Sequelize
   */
  async findByNameAndInfo(full_name, address, date_of_birth) {
    let dob = date_of_birth;
    if (dob instanceof Date) {
      dob = dob.toISOString().split('T')[0];
    } else if (typeof dob === 'string') {
      dob = dob.split('T')[0];
    }

    return this.findOne({ full_name, address, date_of_birth: dob });
  }
}

const instance = new StudentModel();
instance.Model = Student;
module.exports = instance;
