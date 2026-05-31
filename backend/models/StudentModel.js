const BaseModel = require('./BaseModel');
const studentsData = require('../data/students');

class StudentModel extends BaseModel {
  constructor() {
    super(studentsData);
  }

  /**
   * Helper to generate a new student ID (HS0001)
   */
  async generateNextId() {
    const prefix = 'HS';
    const allStudents = this.data;

    if (allStudents.length === 0) return 'HS0001';

    const getNumber = (str) => parseInt(str.replace(prefix, '')) || 0;

    const latestStudent = allStudents.reduce((max, current) =>
      getNumber(current.id) > getNumber(max.id) ? current : max
    );

    const idNumber = getNumber(latestStudent.id) + 1;
    return `${prefix}${String(idNumber).padStart(4, '0')}`;
  }

  async findByNameAndInfo(full_name, address, date_of_birth) {
    return this.findOne({ full_name, address, date_of_birth });
  }
}

module.exports = new StudentModel();
