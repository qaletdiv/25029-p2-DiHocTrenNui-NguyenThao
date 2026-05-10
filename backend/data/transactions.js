const { TRANSACTION_STATUS } = require('./constants');

const transactions = [
  {
    id: "TX00000001",
    date: "2025-10-01",
    amount: 18000000,
    content: "Chuyen tien cho DH92.001",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0001",
    student_id: "DH92.001"
  },
  {
    id: "TX00000002",
    date: "2025-09-01",
    amount: 4000000,
    content: "Chuyen tien cho DH92.002",
    status_id: TRANSACTION_STATUS.OPENED,
    sponsor_id: null,
    student_id: null
  },
  {
    id: "TX00000003",
    date: "2025-11-01",
    amount: 1000000,
    content: "Chuyen tien cho DH92.003",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0002",
    student_id: "DH92.003"
  },
  {
    id: "TX00000004",
    date: "2025-04-01",
    amount: 5000000,
    content: "Chuyen tien cho DH92.004",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0003",
    student_id: "DH92.004"
  },
  {
    id: "TX00000005",
    date: "2025-01-01",
    amount: 6000000,
    content: "Chuyen tien cho DH92.005",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0003",
    student_id: "DH92.005"
  },
  {
    id: "TX00000006",
    date: "2025-09-01",
    amount: 6000000,
    content: "Chuyen tien cho DH92.006",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0003",
    student_id: "DH92.006"
  },
  {
    id: "TX00000007",
    date: "2025-11-01",
    amount: 3000000,
    content: "Chuyen tien cho DH92.007",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0004",
    student_id: "DH92.007"
  },
  {
    id: "TX00000008",
    date: "2025-06-01",
    amount: 3000000,
    content: "Chuyen tien cho DH92.008",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0005",
    student_id: "DH92.008"
  },
  {
    id: "TX00000009",
    date: "2025-06-01",
    amount: 6000000,
    content: "Chuyen tien cho DH92.009",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0005",
    student_id: "DH92.009"
  },
  {
    id: "TX00000010",
    date: "2025-08-01",
    amount: 3000000,
    content: "Chuyen tien cho DH92.010",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0006",
    student_id: "DH92.010"
  },
  {
    id: "TX00000011",
    date: "2025-04-01",
    amount: 4500000,
    content: "Chuyen tien cho DH92.011",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0007",
    student_id: "DH92.011"
  },
  {
    id: "TX00000012",
    date: "2025-07-01",
    amount: 2000000,
    content: "Chuyen tien cho DH92.012",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0007",
    student_id: "DH92.012"
  },
  {
    id: "TX00000013",
    date: "2025-07-01",
    amount: 3000000,
    content: "Chuyen tien cho DH92.013",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0008",
    student_id: "DH92.013"
  },
  {
    id: "TX00000014",
    date: "2025-02-01",
    amount: 5500000,
    content: "Chuyen tien cho DH92.014",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0009",
    student_id: "DH92.014"
  },
  {
    id: "TX00000015",
    date: "2025-11-01",
    amount: 2000000,
    content: "Chuyen tien cho DH92.015",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0009",
    student_id: "DH92.015"
  },
  {
    id: "TX00000016",
    date: "2025-09-01",
    amount: 3000000,
    content: "Chuyen tien cho DH92.016",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0009",
    student_id: "DH92.016"
  },
  {
    id: "TX00000017",
    date: "2025-10-01",
    amount: 1500000,
    content: "Chuyen tien cho DH92.017",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0010",
    student_id: "DH92.017"
  },
  {
    id: "TX00000018",
    date: "2025-05-01",
    amount: 5000000,
    content: "Chuyen tien cho DH92.018",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0011",
    student_id: "DH92.018"
  },
  {
    id: "TX00000019",
    date: "2025-01-01",
    amount: 6000000,
    content: "Chuyen tien cho DH92.019",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0011",
    student_id: "DH92.019"
  },
  {
    id: "TX00000020",
    date: "2025-06-01",
    amount: 3500000,
    content: "Chuyen tien cho DH92.020",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0012",
    student_id: "DH92.020"
  },
  {
    id: "TX00000021",
    date: "2025-11-01",
    amount: 1000000,
    content: "Chuyen tien cho DH92.021",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0013",
    student_id: "DH92.021"
  },
  {
    id: "TX00000022",
    date: "2025-09-01",
    amount: 2000000,
    content: "Chuyen tien cho DH92.022",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0013",
    student_id: "DH92.022"
  },
  {
    id: "TX00000023",
    date: "2025-04-01",
    amount: 4500000,
    content: "Chuyen tien cho DH92.023",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0014",
    student_id: "DH92.023"
  },
  {
    id: "TX00000024",
    date: "2025-07-01",
    amount: 3000000,
    content: "Chuyen tien cho DH92.024",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0015",
    student_id: "DH92.024"
  },
  {
    id: "TX00000025",
    date: "2025-03-01",
    amount: 6000000,
    content: "Chuyen tien cho DH92.025",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0015",
    student_id: "DH92.025"
  },
  {
    id: "TX00000026",
    date: "2025-08-01",
    amount: 3000000,
    content: "Chuyen tien cho DH92.026",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0016",
    student_id: "DH92.026"
  },
  {
    id: "TX00000027",
    date: "2025-09-01",
    amount: 2000000,
    content: "Chuyen tien cho DH92.027",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0017",
    student_id: "DH92.027"
  },
  {
    id: "TX00000028",
    date: "2025-10-01",
    amount: 1500000,
    content: "Chuyen tien cho DH92.028",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0018",
    student_id: "DH92.028"
  },
  {
    id: "TX00000029",
    date: "2025-05-01",
    amount: 5000000,
    content: "Chuyen tien cho DH92.029",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0019",
    student_id: "DH92.029"
  },
  {
    id: "TX00000030",
    date: "2025-01-01",
    amount: 6000000,
    content: "Chuyen tien cho DH92.030",
    status_id: TRANSACTION_STATUS.APPROVED,
    sponsor_id: "NHT0020",
    student_id: "DH92.030"
  }
];

module.exports = transactions;
