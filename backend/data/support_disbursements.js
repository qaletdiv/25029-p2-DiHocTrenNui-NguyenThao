const support_disbursements = [
  {
    id: 1,
    bank_transaction_id: 1,
    sponsor_student_id: 1,
    student_id: 'DH92.001',
    teacher_id: 1,
    support_month: 10,
    support_year: 2025,
    amount: 500000,
    delivered_at: new Date('2025-10-15'),
    status_id: 3, // DELIVERED_TO_STUDENT
    created_at: new Date('2025-10-15'),
  },
  {
    id: 2,
    bank_transaction_id: 2,
    sponsor_student_id: 2,
    student_id: 'DH92.002',
    teacher_id: 2,
    support_month: 9,
    support_year: 2025,
    amount: 500000,
    delivered_at: new Date('2025-09-15'),
    status_id: 3, // DELIVERED_TO_STUDENT
    created_at: new Date('2025-09-15'),
  }
];

module.exports = support_disbursements;
