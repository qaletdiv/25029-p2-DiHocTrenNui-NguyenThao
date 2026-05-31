const validateStudent = (data, isUpdate = false) => {
  const errors = [];
  const { 
    full_name, address, date_of_birth, situation, family_condition,
    status_id, school_id 
  } = data;

  const actualFamilyCondition = family_condition !== undefined ? family_condition : situation;

  if (!isUpdate) {
    if (!full_name) errors.push('Full name is required');
    if (!address) errors.push('Address is required');
    if (!date_of_birth) errors.push('Date of birth is required');
    if (actualFamilyCondition === undefined || actualFamilyCondition === null || actualFamilyCondition === '') {
      errors.push('Family condition is required');
    }
    if (!status_id) errors.push('Status ID is required');
    if (!school_id) errors.push('School ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateStudent
};
