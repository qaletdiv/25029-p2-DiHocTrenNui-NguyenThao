const BaseModel = require('./BaseModel');
const volunteersData = require('../data/volunteers');

class VolunteerModel extends BaseModel {
  constructor() {
    super(volunteersData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 1;
    const maxId = Math.max(...this.data.map(v => v.id));
    return maxId + 1;
  }
}

module.exports = new VolunteerModel();
