const BaseModel = require('./BaseModel');
const schoolsData = require('../data/schools');

class SchoolModel extends BaseModel {
  constructor() {
    super(schoolsData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 1;
    const maxId = Math.max(...this.data.map(s => s.id));
    return maxId + 1;
  }

  async findByName(name) {
    return this.findOne({ name });
  }
}

module.exports = new SchoolModel();
