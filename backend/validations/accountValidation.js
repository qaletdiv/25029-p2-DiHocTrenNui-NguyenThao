const validateAccount = (data, isUpdate = false) => {
  const errors = [];
  const { username, email, password, role_id } = data;

  if (!isUpdate) {
    if (!username) errors.push('Username is required');
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
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
  validateAccount
};
