const ROLE_PERMISSIONS = [
  // Admin (Role ID 1) - All permissions 1-37
  ...Array.from({ length: 37 }, (_, i) => ({ id: i + 1, role_id: 1, permission_id: i + 1 })),

  // Volunteer (Role ID 2)
  { id: 38, role_id: 2, permission_id: 2 }, // STUDENT_READ
  { id: 39, role_id: 2, permission_id: 3 }, // STUDENT_UPDATE
  { id: 40, role_id: 2, permission_id: 6 }, // SPONSOR_READ
  { id: 41, role_id: 2, permission_id: 10 }, // SCHOOL_READ
  { id: 42, role_id: 2, permission_id: 13 }, // BANK_TRANSACTION_CREATE
  { id: 43, role_id: 2, permission_id: 14 }, // BANK_TRANSACTION_READ
  { id: 44, role_id: 2, permission_id: 15 }, // BANK_TRANSACTION_UPDATE
  { id: 45, role_id: 2, permission_id: 22 }, // IMAGE_CREATE
  { id: 46, role_id: 2, permission_id: 37 }, // IMAGE_UPDATE
  { id: 47, role_id: 2, permission_id: 23 }, // IMAGE_READ
  { id: 48, role_id: 2, permission_id: 24 }, // IMAGE_DELETE
  { id: 49, role_id: 2, permission_id: 25 }, // REPORT_READ
  { id: 50, role_id: 2, permission_id: 30 }, // TEACHER_READ
  { id: 51, role_id: 2, permission_id: 34 }, // VOLUNTEER_READ
  { id: 52, role_id: 2, permission_id: 26 }, // DISBURSEMENT_CREATE
  { id: 53, role_id: 2, permission_id: 27 }, // DISBURSEMENT_READ
  { id: 54, role_id: 2, permission_id: 28 }, // DISBURSEMENT_UPDATE

  // Teacher (Role ID 3)
  { id: 55, role_id: 3, permission_id: 2 }, // STUDENT_READ
  { id: 56, role_id: 3, permission_id: 3 }, // STUDENT_UPDATE
  { id: 57, role_id: 3, permission_id: 10 }, // SCHOOL_READ
  { id: 58, role_id: 3, permission_id: 22 }, // IMAGE_CREATE
  { id: 59, role_id: 3, permission_id: 37 }, // IMAGE_UPDATE
  { id: 60, role_id: 3, permission_id: 23 }, // IMAGE_READ
  { id: 61, role_id: 3, permission_id: 24 }, // IMAGE_DELETE
  { id: 62, role_id: 3, permission_id: 30 }, // TEACHER_READ
  { id: 63, role_id: 3, permission_id: 6 },  // SPONSOR_READ
  { id: 64, role_id: 3, permission_id: 34 }, // VOLUNTEER_READ

  // Sponsor (Role ID 4)
  { id: 65, role_id: 4, permission_id: 2 }, // STUDENT_READ
  { id: 66, role_id: 4, permission_id: 6 }, // SPONSOR_READ
  { id: 67, role_id: 4, permission_id: 10 }, // SCHOOL_READ
  { id: 68, role_id: 4, permission_id: 30 }, // TEACHER_READ
  { id: 69, role_id: 4, permission_id: 34 }, // VOLUNTEER_READ
  { id: 70, role_id: 4, permission_id: 23 }, // IMAGE_READ

  // Image Update assignments
  { id: 71, role_id: 2, permission_id: 37 }, // Volunteer: IMAGE_UPDATE
  { id: 72, role_id: 3, permission_id: 37 }, // Teacher: IMAGE_UPDATE
];

module.exports = ROLE_PERMISSIONS;