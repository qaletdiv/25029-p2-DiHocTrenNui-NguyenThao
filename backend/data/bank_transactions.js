const bank_transactions = [
  {
    id: 1,
    sponsor_id: 1,
    transaction_code: 'TX1001',
    bank_name: 'Vietcombank',
    account_number: '123456789',
    transfer_date: new Date('2025-10-05'),
    amount: 1500000,
    transfer_content: 'Support for Student HS0001',
    status_id: 2, // VERIFIED
    verified_by: 1,
    verified_at: new Date('2025-10-06'),
    created_at: new Date('2025-10-05'),
  },
  {
    id: 2,
    sponsor_id: 1,
    transaction_code: 'TX1002',
    bank_name: 'Vietcombank',
    account_number: '123456789',
    transfer_date: new Date('2025-09-05'),
    amount: 1500000,
    transfer_content: 'Support for Student HS0004',
    status_id: 2, // VERIFIED
    verified_by: 1,
    verified_at: new Date('2025-09-06'),
    created_at: new Date('2025-09-05'),
  }
];

module.exports = bank_transactions;
