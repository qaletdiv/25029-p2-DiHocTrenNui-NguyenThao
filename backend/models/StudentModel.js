const BaseModel = require('./BaseModel');
const studentsData = require('../data/students');

class StudentModel extends BaseModel {
  constructor() {
    super(studentsData);
  }

  /**
   * Helper to generate a new student ID
   * TODO: In a real DB, this would be auto-increment or UUID
   */
  async generateNextId() {
    if (this.data.length === 0) return 'DH92.001';

    const getNumber = (str) => parseInt(str.split('.').pop()) || 0;
    
    const latestStudent = this.data.reduce((max, current) => 
      getNumber(current.id) > getNumber(max.id) ? current : max
    );
    
    const idNumber = getNumber(latestStudent.id) + 1;
    return `DH92.${String(idNumber).padStart(3, '0')}`;
  }

  async findByNameAndInfo(name, address, birthday) {
    return this.findOne({ name, address, birthday });
  }
}

module.exports = new StudentModel();
