const validateSponsor = (data, isUpdate = false) => {
  const errors = [];
  const { name, contact_info, status_id, volunteer_id } = data;

  if (!isUpdate) {
    if (!name) errors.push('Name is required');
    if (!contact_info) errors.push('Contact info is required');
    if (!status_id) errors.push('Status ID is required');
    if (!volunteer_id) errors.push('Volunteer ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateSponsor
};
