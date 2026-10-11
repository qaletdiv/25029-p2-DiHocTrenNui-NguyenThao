const BaseModel = require('./BaseModel');
const { Permission, Role } = require('./schemas');

class PermissionModel extends BaseModel {
  constructor() {
    super('permissions', 'id', ['id', 'resource_id', 'action_id', 'code'], Permission);
  }

  /**
   * Fetch all permissions associated with a role via Sequelize.
   * @param {number} roleId
   * @returns {Promise<Array<{id: number, resource_id: number, action_id: number, code: string}>>}
   */
  async findByRoleId(roleId) {
    const sql = `
      SELECT p.id, p.resource_id, p.action_id, p.code
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = :roleId
    `;
    const rows = await this.sequelize.query(sql, {
      replacements: { roleId },
      type: this.sequelize.QueryTypes.SELECT,
    });
    return rows;
  }

  /**
   * Helper to fetch permission code strings for a role (used in login / account response)
   * @param {number} roleId
   * @returns {Promise<Array<string>>}
   */
  async getPermissionCodesByRoleId(roleId) {
    const permissions = await this.findByRoleId(roleId);
    return permissions.map(p => p.code);
  }
}

const instance = new PermissionModel();
instance.Model = Permission;
module.exports = instance;
