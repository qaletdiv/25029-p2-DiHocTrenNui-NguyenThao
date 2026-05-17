const BaseModel = require('./BaseModel');
const studentsData = require('../data/students');

class StudentModel extends BaseModel {
  constructor() {
    super(studentsData);
  }

  /**
   * Helper to generate a new student ID (DH92.XXX)
   */
  async generateNextId(addressId) {
    const addresses = require('../data/addresses');
    const wards = require('../data/wards');
    const provinces = require('../data/provinces');

    let provinceCode = '92'; // default to Quang Nam

    if (addressId) {
      const address = addresses.find(a => a.id === parseInt(addressId));
      if (address) {
        const ward = wards.find(w => w.id === address.ward_id);
        if (ward) {
          const province = provinces.find(p => p.id === ward.province_id);
          if (province) {
            provinceCode = province.code;
          }
        }
      }
    }

    const prefix = `DH${provinceCode}`;
    const studentsInProvince = this.data.filter(s => s.id.startsWith(prefix));

    if (studentsInProvince.length === 0) return `${prefix}.001`;

    const getNumber = (str) => parseInt(str.split('.').pop()) || 0;

    const latestStudent = studentsInProvince.reduce((max, current) =>
      getNumber(current.id) > getNumber(max.id) ? current : max
    );

    const idNumber = getNumber(latestStudent.id) + 1;
    return `${prefix}.${String(idNumber).padStart(3, '0')}`;
  }

  async findByNameAndInfo(full_name, address_id, date_of_birth) {
    return this.findOne({ full_name, address_id, date_of_birth });
  }
}

module.exports = new StudentModel();
