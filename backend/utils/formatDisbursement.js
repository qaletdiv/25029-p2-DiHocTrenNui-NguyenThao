const lookupService = require('./lookupService');

/**
 * Transforms a raw support_disbursement object by replacing relation IDs with actual values
 */
const formatDisbursementResponse = (rawDisbursement, lookups = null) => {
  if (!rawDisbursement) return rawDisbursement;

  const studentMap = (lookups && lookups.students) || lookupService.cache.students;
  const teacherMap = (lookups && lookups.teachers) || lookupService.cache.teachers;
  const sponsorMap = (lookups && lookups.sponsors) || lookupService.cache.sponsors;
  const statusMap = (lookups && lookups.disbursementStatuses) || lookupService.cache.disbursementStatuses;
  const bankTxMap = (lookups && lookups.bankTransactions) || lookupService.cache.bankTransactions;
  const sponsorStudentMap = (lookups && lookups.sponsorStudents) || lookupService.cache.sponsorStudents;

  const {
    status_id,
    ...restOfData
  } = rawDisbursement;

  // Resolve student name
  const studentName = (studentMap && studentMap.get(rawDisbursement.student_id)) || rawDisbursement.student_name || null;

  // Resolve teacher name
  const teacherName = (teacherMap && teacherMap.get(rawDisbursement.teacher_id)) || rawDisbursement.teacher_name || null;

  // Resolve status
  const statusObj = statusMap && statusMap.get(status_id);
  const status = statusObj ? statusObj.code : (rawDisbursement.status || null);
  const statusName = statusObj ? statusObj.name : (rawDisbursement.status_name || null);

  // Resolve bank transaction
  const bankTx = bankTxMap && bankTxMap.get(rawDisbursement.bank_transaction_id);
  const transactionCode = bankTx ? bankTx.transaction_code : (rawDisbursement.transaction_code || null);

  // Resolve sponsor via sponsor_student relationship
  const sponsorStudentRel = sponsorStudentMap && sponsorStudentMap.get(rawDisbursement.sponsor_student_id);
  const sponsorId = sponsorStudentRel ? sponsorStudentRel.sponsor_id : (rawDisbursement.sponsor_id || null);
  const sponsorName = (sponsorStudentRel && sponsorMap && sponsorMap.get(sponsorStudentRel.sponsor_id)) || rawDisbursement.sponsor_name || null;

  return {
    ...restOfData,
    student_name: studentName,
    teacher_name: teacherName,
    status,
    status_name: statusName,
    transaction_code: transactionCode,
    sponsor_name: sponsorName,
    sponsor_id: sponsorId,
  };
};

/**
 * Transforms a received disbursement object from the client back to the database-compatible format.
 */
const parseDisbursementRequest = (receivedDisbursement, lookups = null) => {
  if (!receivedDisbursement) return receivedDisbursement;

  const statusMap = (lookups && lookups.disbursementStatuses) || lookupService.cache.disbursementStatuses;

  const {
    student_name,
    teacher_name,
    status,
    status_name,
    transaction_code,
    sponsor_name,
    sponsor_id: _sponsorId,
    created_at,
    ...restOfData
  } = receivedDisbursement;

  const original = { ...restOfData };

  // Resolve status_id from status code
  if (status !== undefined) {
    if (status === null || status === '') {
      original.status_id = null;
    } else if (statusMap) {
      for (const [id, obj] of statusMap.entries()) {
        if (obj.code === status) {
          original.status_id = id;
          break;
        }
      }
    }
  }

  // Handle delivered_at date parsing
  if (original.delivered_at !== undefined && original.delivered_at !== null) {
    if (typeof original.delivered_at === 'string') {
      original.delivered_at = new Date(original.delivered_at);
    }
  }

  // Handle created_at date parsing
  if (created_at !== undefined && created_at !== null) {
    original.created_at = new Date(created_at);
  }

  return original;
};

module.exports = { formatDisbursementResponse, parseDisbursementRequest };
