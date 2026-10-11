const BaseModel = require('./BaseModel');
const { VolunteerStudent } = require('./schemas');

class VolunteerStudentModel extends BaseModel {
  constructor() {
    super(
      'volunteer_students',
      'id',
      [
        'id',
        'student_id',
        'volunteer_id',
        'start_date',
        'end_date',
        'created_at',
        'updated_at',
      ],
      VolunteerStudent
    );
  }

  async findByStudentId(studentId) {
    return this.findOne({ student_id: studentId });
  }

  async findByVolunteerId(volunteerId) {
    return this.findAll({ volunteer_id: volunteerId });
  }

  async deleteByStudentId(studentId) {
    const existing = await this.findOne({ student_id: studentId });
    if (!existing) return false;
    return this.delete(existing.id);
  }
}

const instance = new VolunteerStudentModel();
instance.Model = VolunteerStudent;
module.exports = instance;
