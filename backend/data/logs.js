const logs = [
  {
    id: 1,
    timestamp: "2025-10-01T10:00:00Z",
    user_id: "QTV0001",
    action: "LOGIN",
    details: "Admin logged in from 192.168.1.1",
    status: "SUCCESS"
  },
  {
    id: 2,
    timestamp: "2025-10-01T10:15:00Z",
    user_id: "QTV0001",
    action: "UPDATE_STUDENT",
    details: "Updated student DH92.001 funds",
    status: "SUCCESS"
  },
  {
    id: 3,
    timestamp: "2025-10-02T08:30:00Z",
    user_id: "TNV0001",
    action: "CREATE_TRANSACTION",
    details: "Created transaction for student DH92.003",
    status: "SUCCESS"
  },
  {
    id: 4,
    timestamp: "2025-10-02T09:00:00Z",
    user_id: "NHT0001",
    action: "VIEW_REPORT",
    details: "Sponsor viewed monthly summary report",
    status: "SUCCESS"
  },
  {
    id: 5,
    timestamp: "2025-10-03T14:20:00Z",
    user_id: "GVN0001",
    action: "UPDATE_SCHOOL",
    details: "Updated student count for TR001",
    status: "SUCCESS"
  }
];

module.exports = logs;
