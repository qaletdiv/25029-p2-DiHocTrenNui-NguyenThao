const BaseModel = require('./BaseModel');
const sponsorsData = require('../data/sponsors');

class SponsorModel extends BaseModel {
  constructor() {
    super(sponsorsData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 1;
    const maxId = Math.max(...this.data.map(s => s.id));
    return maxId + 1;
  }

  async findByFullName(full_name) {
    return this.findOne({ full_name });
  }
}

module.exports = new SponsorModel();
