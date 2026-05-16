const BaseModel = require('./BaseModel');
const teachersData = require('../data/teachers');

class TeacherModel extends BaseModel {
  constructor() {
    super(teachersData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 1;
    const maxId = Math.max(...this.data.map(t => t.id));
    return maxId + 1;
  }
}

module.exports = new TeacherModel();
