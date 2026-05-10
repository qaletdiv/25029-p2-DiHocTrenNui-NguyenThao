const BaseModel = require('./BaseModel');
const schoolsData = require('../data/schools');

class SchoolModel extends BaseModel {
  constructor() {
    super(schoolsData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 'TR001';

    const getNumber = (str) => parseInt(str.replace(/^\D+/g, '')) || 0;
    
    const latestSchool = this.data.reduce((max, current) => 
      getNumber(current.id) > getNumber(max.id) ? current : max
    );
    
    const idNumber = getNumber(latestSchool.id) + 1;
    return `TR${String(idNumber).padStart(3, '0')}`;
  }

  async findByName(name) {
    return this.findOne({ name });
  }
}

module.exports = new SchoolModel();
