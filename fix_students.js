const fs = require('fs');
const path = require('path');

const provinces = require('./backend/data/provinces.js');
const wards = require('./backend/data/wards.js');
const addresses = require('./backend/data/addresses.js');
let students = require('./backend/data/students.js');

// Map address_id to province code
const addressToProvince = {};
for (const address of addresses) {
  const ward = wards.find(w => w.id === address.ward_id);
  if (ward) {
    const province = provinces.find(p => p.id === ward.province_id);
    if (province) {
      addressToProvince[address.id] = province.code;
    } else {
      // If province doesn't exist (e.g. ward 10 -> province 6), map it to province 1
      addressToProvince[address.id] = provinces[0].code;
      // Let's also fix addresses.js to ensure valid ward
      address.ward_id = 1; 
    }
  } else {
    addressToProvince[address.id] = provinces[0].code;
    address.ward_id = 1;
  }
}

// Rewrite addresses.js to be safe
const addressesContent = `const addresses = ${JSON.stringify(addresses, null, 2)};\n\nmodule.exports = addresses;\n`;
fs.writeFileSync(path.join(__dirname, 'backend', 'data', 'addresses.js'), addressesContent);

// Generate new IDs
const counters = {};
for (const p of provinces) {
  counters[p.code] = 1;
}

for (const student of students) {
  // Ensure valid address_id
  if (!addressToProvince[student.address_id]) {
    student.address_id = 1; // default
  }
  const code = addressToProvince[student.address_id];
  const seq = counters[code]++;
  const newId = `DH${code}.${String(seq).padStart(3, '0')}`;
  
  // Need to update teacher_students, volunteer_students, sponsor_students because ID changed!
  // Wait, if I change student IDs, I must update relationships!
}
