/**
 * Standardized Response Handler
 */

const sendSuccess = (res, data, message = 'Success', code = 200) => {
  return res.status(code).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message = 'Error', errors = [], code = 500) => {
  return res.status(code).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
