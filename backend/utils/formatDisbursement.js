const students = require('../data/students');
const teachers = require('../data/teachers');
const sponsors = require('../data/sponsors');
const sponsorStudents = require('../data/sponsor_students');
const bankTransactions = require('../data/bank_transactions');
const disbursementStatuses = require('../data/disbursement_statuses');
const accounts = require('../data/accounts');

/**
 * Transforms a raw support_disbursement object by replacing relation IDs with actual values
 */
const formatDisbursementResponse = (rawDisbursement) => {
  if (!rawDisbursement) return rawDisbursement;

  // Build maps dynamically to support in-memory updates
  const studentMap = new Map(students.map(s => [s.id, s.full_name]));
  const teacherMap = new Map(teachers.map(t => [t.id, t.full_name]));
  const sponsorMap = new Map(sponsors.map(s => [s.id, s.full_name]));
  const statusMap = new Map(disbursementStatuses.map(s => [s.id, { code: s.code, name: s.name }]));
  const bankTxMap = new Map(bankTransactions.map(tx => [tx.id, tx]));
  const sponsorStudentMap = new Map(sponsorStudents.map(ss => [ss.id, ss]));

  const {
    status_id,
    ...restOfData
  } = rawDisbursement;

  // Resolve student name
  const studentName = studentMap.get(rawDisbursement.student_id) || null;

  // Resolve teacher name
  const teacherName = teacherMap.get(rawDisbursement.teacher_id) || null;

  // Resolve status
  const statusObj = statusMap.get(status_id);
  const status = statusObj ? statusObj.code : null;
  const statusName = statusObj ? statusObj.name : null;

  // Resolve bank transaction
  const bankTx = bankTxMap.get(rawDisbursement.bank_transaction_id);
  const transactionCode = bankTx ? bankTx.transaction_code : null;

  // Resolve sponsor via sponsor_student relationship
  const sponsorStudentRel = sponsorStudentMap.get(rawDisbursement.sponsor_student_id);
  const sponsorName = sponsorStudentRel ? (sponsorMap.get(sponsorStudentRel.sponsor_id) || null) : null;
  const sponsorId = sponsorStudentRel ? sponsorStudentRel.sponsor_id : null;

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
const parseDisbursementRequest = (receivedDisbursement) => {
  if (!receivedDisbursement) return receivedDisbursement;

  const statusMap = new Map(disbursementStatuses.map(s => [s.id, { code: s.code, name: s.name }]));

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
    } else {
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

