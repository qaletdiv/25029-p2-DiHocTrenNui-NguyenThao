const validateSchool = (data, isUpdate = false) => {
  const errors = [];
  const { name, address, teacher_id } = data;

  if (!isUpdate) {
    if (!name) errors.push('Name is required');
    if (!address) errors.push('Address is required');
    if (!teacher_id) errors.push('Teacher ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateSchool
};
