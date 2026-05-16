const PERMISSIONS = [
  // Students
  { id: 1, resource_id: 1, action_id: 1, code: 'STUDENT_CREATE' },
  { id: 2, resource_id: 1, action_id: 2, code: 'STUDENT_READ' },
  { id: 3, resource_id: 1, action_id: 3, code: 'STUDENT_UPDATE' },
  { id: 4, resource_id: 1, action_id: 4, code: 'STUDENT_DELETE' },
  
  // Sponsors
  { id: 5, resource_id: 2, action_id: 1, code: 'SPONSOR_CREATE' },
  { id: 6, resource_id: 2, action_id: 2, code: 'SPONSOR_READ' },
  { id: 7, resource_id: 2, action_id: 3, code: 'SPONSOR_UPDATE' },
  { id: 8, resource_id: 2, action_id: 4, code: 'SPONSOR_DELETE' },

  // Schools
  { id: 9, resource_id: 3, action_id: 1, code: 'SCHOOL_CREATE' },
  { id: 10, resource_id: 3, action_id: 2, code: 'SCHOOL_READ' },
  { id: 11, resource_id: 3, action_id: 3, code: 'SCHOOL_UPDATE' },
  { id: 12, resource_id: 3, action_id: 4, code: 'SCHOOL_DELETE' },

  // Bank Transactions
  { id: 13, resource_id: 4, action_id: 1, code: 'BANK_TRANSACTION_CREATE' },
  { id: 14, resource_id: 4, action_id: 2, code: 'BANK_TRANSACTION_READ' },
  { id: 15, resource_id: 4, action_id: 3, code: 'BANK_TRANSACTION_UPDATE' },
  { id: 16, resource_id: 4, action_id: 4, code: 'BANK_TRANSACTION_DELETE' },
  { id: 17, resource_id: 4, action_id: 5, code: 'BANK_TRANSACTION_APPROVE' },

  // Users
  { id: 18, resource_id: 5, action_id: 1, code: 'USER_CREATE' },
  { id: 19, resource_id: 5, action_id: 2, code: 'USER_READ' },
  { id: 20, resource_id: 5, action_id: 3, code: 'USER_UPDATE' },
  { id: 21, resource_id: 5, action_id: 4, code: 'USER_DELETE' },

  // Images
  { id: 22, resource_id: 6, action_id: 1, code: 'IMAGE_CREATE' },
  { id: 23, resource_id: 6, action_id: 2, code: 'IMAGE_READ' },
  { id: 24, resource_id: 6, action_id: 4, code: 'IMAGE_DELETE' },

  // Reports
  { id: 25, resource_id: 7, action_id: 2, code: 'REPORT_READ' },

  // Disbursements
  { id: 26, resource_id: 8, action_id: 1, code: 'DISBURSEMENT_CREATE' },
  { id: 27, resource_id: 8, action_id: 2, code: 'DISBURSEMENT_READ' },
  { id: 28, resource_id: 8, action_id: 3, code: 'DISBURSEMENT_UPDATE' },
];

module.exports = PERMISSIONS;