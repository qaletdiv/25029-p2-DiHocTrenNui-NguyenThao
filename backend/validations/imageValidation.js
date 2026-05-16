const validateImage = (data, isUpdate = false) => {
  const errors = [];
  const { student_id, url, timestamp } = data;

  if (!isUpdate) {
    if (!student_id) errors.push('Student ID is required');
    if (!url) errors.push('URL is required');
    if (!timestamp) errors.push('Timestamp is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateImage
};
