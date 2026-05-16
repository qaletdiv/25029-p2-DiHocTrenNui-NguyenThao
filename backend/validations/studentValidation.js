const validateStudent = (data, isUpdate = false) => {
  const errors = [];
  const { 
    full_name, address_id, date_of_birth, situation, 
    status_id, school_id 
  } = data;

  if (!isUpdate) {
    if (!full_name) errors.push('Full name is required');
    if (!address_id) errors.push('Address ID is required');
    if (!date_of_birth) errors.push('Date of birth is required');
    if (!situation) errors.push('Situation is required');
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
