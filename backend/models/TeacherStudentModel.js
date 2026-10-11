const BaseModel = require('./BaseModel');
const { TeacherStudent } = require('./schemas');

class TeacherStudentModel extends BaseModel {
  constructor() {
    super(
      'teacher_students',
      'id',
      [
        'id',
        'student_id',
        'teacher_id',
        'start_date',
        'end_date',
        'created_at',
        'updated_at',
      ],
      TeacherStudent
    );
  }

  async findByStudentId(studentId) {
    return this.findOne({ student_id: studentId });
  }

  async findByTeacherId(teacherId) {
    return this.findAll({ teacher_id: teacherId });
  }

  async deleteByStudentId(studentId) {
    const existing = await this.findOne({ student_id: studentId });
    if (!existing) return false;
    return this.delete(existing.id);
  }
}

const instance = new TeacherStudentModel();
instance.Model = TeacherStudent;
module.exports = instance;
