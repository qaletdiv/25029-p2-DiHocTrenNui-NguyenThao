const BaseModel = require('./BaseModel');
const { SponsorStudent } = require('./schemas');

class SponsorStudentModel extends BaseModel {
  constructor() {
    super(
      'sponsor_students',
      'id',
      [
        'id',
        'student_id',
        'sponsor_id',
        'monthly_amount',
        'created_at',
        'updated_at',
      ],
      SponsorStudent
    );
  }

  async findByStudentId(studentId) {
    return this.findOne({ student_id: studentId });
  }

  async findBySponsorId(sponsorId) {
    return this.findAll({ sponsor_id: sponsorId });
  }

  async deleteByStudentId(studentId) {
    const existing = await this.findOne({ student_id: studentId });
    if (!existing) return false;
    return this.delete(existing.id);
  }
}

const instance = new SponsorStudentModel();
instance.Model = SponsorStudent;
module.exports = instance;
