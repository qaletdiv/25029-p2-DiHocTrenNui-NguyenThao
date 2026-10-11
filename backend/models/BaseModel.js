const { sequelize, Op } = require('../config/sequelize');

/**
 * BaseModel - Data Access Layer backed by Sequelize Models connected to TiDB.
 * Provides standard CRUD and lookup operations using Sequelize ORM methods.
 */
class BaseModel {
  /**
   * @param {string} tableName - The TiDB table name
   * @param {string} primaryKey - The primary key column name (defaults to 'id')
   * @param {Array<string>} [allowedColumns] - Optional column whitelist
   * @param {import('sequelize').Model} [sequelizeModel] - The underlying Sequelize Model
   */
  constructor(tableName, primaryKey = 'id', allowedColumns = null, sequelizeModel = null) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.allowedColumns = allowedColumns;
    this.model = sequelizeModel;
    this.sequelize = sequelize;
    this.Op = Op;
  }

  /**
   * Filter fields to valid table columns, stripping undefined and non-whitelisted properties.
   */
  filterFields(data) {
    if (!data || typeof data !== 'object') return {};
    const filtered = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      if (this.allowedColumns && !this.allowedColumns.includes(key)) continue;
      filtered[key] = value;
    }
    return filtered;
  }

  /**
   * Find all records matching optional conditions.
   * @param {Object} [conditions] - Key-value equality conditions
   * @param {string|Array} [orderBy] - Optional ORDER BY clause or array
   * @returns {Promise<Array<Object>>}
   */
  async findAll(conditions = {}, orderBy = null) {
    const options = { raw: true };

    if (conditions && typeof conditions === 'object') {
      const where = {};
      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined) {
          where[key] = value;
        }
      }
      if (Object.keys(where).length > 0) {
        options.where = where;
      }
    }

    if (orderBy) {
      if (Array.isArray(orderBy)) {
        options.order = orderBy;
      } else if (typeof orderBy === 'string') {
        // e.g. "timestamp DESC" or "id ASC, created_at DESC"
        const parts = orderBy.split(',').map(part => {
          const [col, dir] = part.trim().split(/\s+/);
          return [col, dir ? dir.toUpperCase() : 'ASC'];
        });
        options.order = parts;
      }
    }

    return await this.model.findAll(options);
  }

  /**
   * Find a single record by primary key.
   * @param {any} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    if (id === undefined || id === null) return null;
    const record = await this.model.findByPk(id, { raw: true });
    return record || null;
  }

  /**
   * Find a single record matching given conditions.
   * @param {Object} query - Key-value pairs for WHERE clause
   * @returns {Promise<Object|null>}
   */
  async findOne(query) {
    if (!query || typeof query !== 'object') return null;

    const where = {};
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        where[key] = value;
      }
    }

    if (Object.keys(where).length === 0) return null;

    const record = await this.model.findOne({ where, raw: true });
    return record || null;
  }

  /**
   * Create a new record in TiDB via Sequelize.
   * @param {Object} newItem
   * @returns {Promise<Object>}
   */
  async create(newItem) {
    const validData = this.filterFields(newItem);
    const keys = Object.keys(validData);
    if (keys.length === 0) {
      throw new Error(`Cannot insert empty record into ${this.tableName}`);
    }

    const created = await this.model.create(validData);
    return created.get({ plain: true });
  }

  /**
   * Update an existing record in TiDB via Sequelize.
   * @param {any} id
   * @param {Object} updatedFields
   * @returns {Promise<Object|null>}
   */
  async update(id, updatedFields) {
    if (id === undefined || id === null) return null;

    const validData = this.filterFields(updatedFields);
    delete validData[this.primaryKey];

    const keys = Object.keys(validData);
    if (keys.length === 0) {
      return await this.findById(id);
    }

    await this.model.update(validData, {
      where: { [this.primaryKey]: id },
    });

    return await this.findById(id);
  }

  /**
   * Delete a record by primary key via Sequelize.
   * @param {any} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    if (id === undefined || id === null) return false;
    const count = await this.model.destroy({
      where: { [this.primaryKey]: id },
    });
    return count > 0;
  }

  /**
   * Helper to generate the next auto-increment integer ID for this table via Sequelize.
   * @returns {Promise<number>}
   */
  async generateNextId() {
    const max = await this.model.max(this.primaryKey);
    return (Number(max) || 0) + 1;
  }
}

module.exports = BaseModel;
