const validateUser = (data, isUpdate = false) => {
  const errors = [];
  const { name, email, password_hash, phone, role_id } = data;

  if (!isUpdate) {
    if (!name) errors.push('Name is required');
    if (!email) errors.push('Email is required');
    if (!password_hash) errors.push('Password hash is required');
    if (!phone) errors.push('Phone is required');
    if (!role_id) errors.push('Role ID is required');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateUser
};
