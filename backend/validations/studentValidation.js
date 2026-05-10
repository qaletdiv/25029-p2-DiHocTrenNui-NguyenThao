const validateStudent = (data, isUpdate = false) => {
  const errors = [];
  const { 
    name, address, birthday, ethnicity, situation, 
    recommender_name, status_id, start_date, class_level, school_id 
  } = data;

  if (!isUpdate) {
    if (!name) errors.push('Name is required');
    if (!address) errors.push('Address is required');
    if (!birthday) errors.push('Birthday is required');
    if (!ethnicity) errors.push('Ethnicity is required');
    if (!situation) errors.push('Situation is required');
    if (!recommender_name) errors.push('Recommender name is required');
    if (!status_id) errors.push('Status ID is required');
    if (!start_date) errors.push('Start date is required');
    if (!class_level) errors.push('Class level is required');
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
