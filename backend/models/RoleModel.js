const BaseModel = require('./BaseModel');
const { Role } = require('./schemas');

class RoleModel extends BaseModel {
  constructor() {
    super('roles', 'id', ['id', 'code', 'name'], Role);
  }

  async findByCode(code) {
    return this.findOne({ code });
  }
}

const instance = new RoleModel();
instance.Model = Role;
module.exports = instance;
