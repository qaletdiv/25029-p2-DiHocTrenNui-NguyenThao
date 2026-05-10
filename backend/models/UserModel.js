const BaseModel = require('./BaseModel');
const usersData = require('../data/users');

class UserModel extends BaseModel {
  constructor() {
    super(usersData);
  }

  // Add user-specific methods here
  async findByEmail(email) {
    return this.findOne({ email });
  }

  /**
   * Helper to generate a new user ID based on role
   */
  async generateNextId(role_id) {
    const usersByRole = this.data.filter(user => user.role_id === role_id);
    if (usersByRole.length === 0) return `${role_id.toUpperCase()}0001`;

    const getNumber = (str) => parseInt(str.replace(/^\D+/g, '')) || 0;
    const latestUser = usersByRole.reduce((max, current) => 
      getNumber(current.id) > getNumber(max.id) ? current : max
    );
    
    const idNumber = getNumber(latestUser.id) + 1;
    const prefixMap = {
      admin: 'QTV',
      volunteer: 'TNV',
      sponsor: 'NHT',
      teacher: 'GVN'
    };
    
    const prefix = prefixMap[role_id] || 'USR';
    return `${prefix}${String(idNumber).padStart(4, '0')}`;
  }
}

module.exports = new UserModel();
