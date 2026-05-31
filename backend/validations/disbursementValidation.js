/**
 * Validation for Support Disbursement
 */
const validateDisbursement = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate) {
    if (!data.student_id) errors.push('student_id is required');
    if (!data.bank_transaction_id) errors.push('bank_transaction_id is required');
    if (data.amount === undefined || data.amount === null) errors.push('amount is required');
    if (data.support_month === undefined || data.support_month === null) errors.push('support_month is required');
    if (data.support_year === undefined || data.support_year === null) errors.push('support_year is required');
  }

  // Validate amount if provided
  if (data.amount !== undefined && data.amount !== null) {
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('amount must be a positive number');
    }
  }

  // Validate month if provided
  if (data.support_month !== undefined && data.support_month !== null) {
    const month = Number(data.support_month);
    if (isNaN(month) || month < 1 || month > 12) {
      errors.push('support_month must be between 1 and 12');
    }
  }

  // Validate year if provided
  if (data.support_year !== undefined && data.support_year !== null) {
    const year = Number(data.support_year);
    if (isNaN(year) || year < 2000 || year > 2100) {
      errors.push('support_year must be between 2000 and 2100');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = { validateDisbursement };
