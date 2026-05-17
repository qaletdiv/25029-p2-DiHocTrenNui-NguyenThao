const addresses = require('../data/addresses');
const wards = require('../data/wards');
const provinces = require('../data/provinces');
const schools = require('../data/schools');
const studentStatuses = require('../data/student_statuses');
const accounts = require('../data/accounts');

// Pre-compute lookup maps for O(1) access time
const provinceMap = new Map(provinces.map(p => [p.id, p.name]));
const wardMap = new Map(wards.map(w => [w.id, { name: w.name, province_id: w.province_id }]));

const addressMap = new Map(addresses.map(a => {
  const ward = wardMap.get(a.ward_id) || {};
  const provinceName = provinceMap.get(ward.province_id) || '';
  const wardName = ward.name || '';
  
  // Construct full string: [address_line], [ward name], [province name]
  const fullAddress = [a.address_line, wardName, provinceName]
    .filter(Boolean)
    .join(', ');
    
  return [a.id, fullAddress];
}));

const schoolMap = new Map(schools.map(s => [s.id, s.name]));
const statusMap = new Map(studentStatuses.map(s => [s.id, s.code]));
const accountMap = new Map(accounts.map(a => [a.id, a.username]));

/**
 * Transforms a raw student object by replacing relation IDs with actual string values
 */
const formatStudentResponse = (rawStudent) => {
  if (!rawStudent) return rawStudent;
  
  const {
    address_id,
    school_id,
    status_id,
    created_by,
    ...restOfStudentData
  } = rawStudent;

  return {
    ...restOfStudentData,
    address: addressMap.get(address_id) || null,
    school: schoolMap.get(school_id) || null,
    status: statusMap.get(status_id) || null,
    creator: accountMap.get(created_by) || null,
  };
};

/**
 * Transforms an enriched/received student object from the client back to the database-compatible format.
 * This resolves virtual text fields (address, school, status) to their foreign key IDs (address_id, school_id, status_id),
 * parses ISO strings to Date objects for timestamps, and removes extra visual helper properties.
 */
const parseStudentRequest = (receivedStudent) => {
  if (!receivedStudent) return receivedStudent;

  const {
    address,
    school,
    status,
    creator,
    created_at,
    updated_at,
    ...restOfStudentData
  } = receivedStudent;

  const originalStudent = {
    ...restOfStudentData,
  };

  // 1. Resolve address_id from address text if not present or if text is provided
  if (address !== undefined) {
    if (address === null || address === '') {
      originalStudent.address_id = null;
    } else {
      let foundAddressId = null;
      for (const [id, fullAddr] of addressMap.entries()) {
        if (fullAddr === address) {
          foundAddressId = id;
          break;
        }
      }
      if (foundAddressId !== null) {
        originalStudent.address_id = foundAddressId;
      }
    }
  }

  // 2. Resolve school_id from school name
  if (school !== undefined) {
    if (school === null || school === '') {
      originalStudent.school_id = null;
    } else {
      let foundSchoolId = null;
      for (const [id, name] of schoolMap.entries()) {
        if (name === school) {
          foundSchoolId = id;
          break;
        }
      }
      if (foundSchoolId !== null) {
        originalStudent.school_id = foundSchoolId;
      }
    }
  }

  // 3. Resolve status_id from status code (e.g. 'ACTIVE') or status name (e.g. 'Đang hỗ trợ')
  if (status !== undefined) {
    if (status === null || status === '') {
      originalStudent.status_id = null;
    } else {
      let foundStatusId = null;
      // Match by code first
      for (const [id, code] of statusMap.entries()) {
        if (code === status) {
          foundStatusId = id;
          break;
        }
      }
      // Fallback: match by name
      if (foundStatusId === null) {
        const found = studentStatuses.find(s => s.name === status);
        if (found) {
          foundStatusId = found.id;
        }
      }
      if (foundStatusId !== null) {
        originalStudent.status_id = foundStatusId;
      }
    }
  }

  // 4. Handle date_of_birth formatting: ensure string format 'YYYY-MM-DD'
  if (originalStudent.date_of_birth !== undefined && originalStudent.date_of_birth !== null) {
    if (originalStudent.date_of_birth instanceof Date) {
      originalStudent.date_of_birth = originalStudent.date_of_birth.toISOString().split('T')[0];
    } else if (typeof originalStudent.date_of_birth === 'string') {
      originalStudent.date_of_birth = originalStudent.date_of_birth.split('T')[0];
    }
  }

  // 5. Handle timestamp parsing to Date objects (created_at, updated_at)
  if (created_at !== undefined && created_at !== null) {
    originalStudent.created_at = new Date(created_at);
  }
  if (updated_at !== undefined && updated_at !== null) {
    originalStudent.updated_at = new Date(updated_at);
  }

  return originalStudent;
};

module.exports = { formatStudentResponse, parseStudentRequest };

