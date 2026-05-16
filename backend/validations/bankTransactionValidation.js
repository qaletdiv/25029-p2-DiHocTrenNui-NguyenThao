const validateBankTransaction = (data, isUpdate = false) => {
  const errors = [];
  const { transfer_date, amount, transfer_content, status_id } = data;

  if (!isUpdate) {
    if (!transfer_date) errors.push('Transfer date is required');
    if (!amount) errors.push('Amount is required');
    if (!transfer_content) errors.push('Transfer content is required');
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
  validateBankTransaction
};
