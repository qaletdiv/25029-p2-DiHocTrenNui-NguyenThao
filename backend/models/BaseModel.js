/**
 * BaseModel - Abstracted Data Access Layer for File-based Data
 * This structure is designed to be easily swappable with an ORM.
 */

class BaseModel {
  constructor(data) {
    this.data = data;
  }

  async findAll() {
    return this.data;
  }

  async findById(id) {
    return this.data.find(item => item.id === id);
  }

  async findOne(query) {
    return this.data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  async create(newItem) {
    this.data.push(newItem);
    return newItem;
  }

  async update(id, updatedFields) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.data[index] = { ...this.data[index], ...updatedFields };
    return this.data[index];
  }

  async delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.data.splice(index, 1);
    return true;
  }
}

module.exports = BaseModel;
