const validateTeacher = (data, isUpdate = false) => {
  const errors = [];
  const { account_id, school_id, full_name, phone, email, gender } = data;

  if (!isUpdate) {
    if (!account_id) errors.push('Account ID is required');
    if (!school_id) errors.push('School ID is required');
    if (!full_name) errors.push('Full name is required');
    if (!phone) errors.push('Phone is required');
    if (!email) errors.push('Email is required');
    if (!gender) errors.push('Gender is required');
  }

  // Basic email validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateTeacher
};
