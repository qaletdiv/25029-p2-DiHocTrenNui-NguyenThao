const validateTransaction = (data, isUpdate = false) => {
  const errors = [];
  const { date, amount, content, status_id } = data;

  if (!isUpdate) {
    if (!date) errors.push('Date is required');
    if (!amount) errors.push('Amount is required');
    if (!content) errors.push('Content is required');
    if (!status_id) errors.push('Status ID is required');
  }

  if (amount && isNaN(amount)) {
    errors.push('Amount must be a number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateTransaction
};
