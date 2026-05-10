const BaseModel = require('./BaseModel');
const sponsorsData = require('../data/sponsors');

class SponsorModel extends BaseModel {
  constructor() {
    super(sponsorsData);
  }

  async generateNextId() {
    if (this.data.length === 0) return 'NHT0001';

    const getNumber = (str) => parseInt(str.replace(/^\D+/g, '')) || 0;
    
    const latestSponsor = this.data.reduce((max, current) => 
      getNumber(current.id) > getNumber(max.id) ? current : max
    );
    
    const idNumber = getNumber(latestSponsor.id) + 1;
    return `NHT${String(idNumber).padStart(4, '0')}`;
  }

  async findByName(name) {
    return this.findOne({ name });
  }
}

module.exports = new SponsorModel();
