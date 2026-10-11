const db = require('../config/db');

/**
 * LookupService - Provides cached in-memory lookups backed by TiDB queries.
 * Keeps response formatting fast and scalable while ensuring real-time consistency.
 */
class LookupService {
  constructor() {
    this.cache = {
      accounts: null,
      schools: null,
      studentStatuses: null,
      disbursementStatuses: null,
      teachers: null,
      sponsors: null,
      students: null,
      bankTransactions: null,
      sponsorStudents: null,
    };
    this.cacheTime = 0;
    this.TTL_MS = 30000; // 30-second TTL
  }

  isExpired() {
    return Date.now() - this.cacheTime > this.TTL_MS;
  }

  invalidateCache() {
    this.cacheTime = 0;
  }

  async refresh() {
    try {
      const [
        [accounts],
        [schools],
        [studentStatuses],
        [disbursementStatuses],
        [teachers],
        [sponsors],
        [students],
        [bankTransactions],
        [sponsorStudents],
      ] = await Promise.all([
        db.query('SELECT id, username FROM accounts'),
        db.query('SELECT id, name FROM schools'),
        db.query('SELECT id, code, name FROM student_statuses'),
        db.query('SELECT id, code, name FROM disbursement_statuses'),
        db.query('SELECT id, full_name FROM teachers'),
        db.query('SELECT id, full_name FROM sponsors'),
        db.query('SELECT id, full_name FROM students'),
        db.query('SELECT id, transaction_code, amount FROM bank_transactions'),
        db.query('SELECT id, student_id, sponsor_id FROM sponsor_students'),
      ]);

      this.cache = {
        accounts: new Map(accounts.map(a => [a.id, a.username])),
        schools: new Map(schools.map(s => [s.id, s.name])),
        studentStatuses: studentStatuses,
        studentStatusMap: new Map(studentStatuses.map(s => [s.id, s.code])),
        disbursementStatuses: new Map(disbursementStatuses.map(s => [s.id, { code: s.code, name: s.name }])),
        teachers: new Map(teachers.map(t => [t.id, t.full_name])),
        sponsors: new Map(sponsors.map(s => [s.id, s.full_name])),
        students: new Map(students.map(s => [s.id, s.full_name])),
        bankTransactions: new Map(bankTransactions.map(t => [t.id, t])),
        sponsorStudents: new Map(sponsorStudents.map(ss => [ss.id, ss])),
      };
      this.cacheTime = Date.now();
    } catch (err) {
      console.error('[LookupService] Failed to refresh lookups from TiDB:', err.message);
      // Re-throw so callers don't silently mask database connection failures
      throw err;
    }
  }

  async ensureLoaded() {
    if (!this.cache.accounts || this.isExpired()) {
      await this.refresh();
    }
    return this.cache;
  }

  async getAccountMap() {
    await this.ensureLoaded();
    return this.cache.accounts;
  }

  async getSchoolMap() {
    await this.ensureLoaded();
    return this.cache.schools;
  }

  async getStudentStatusMap() {
    await this.ensureLoaded();
    return this.cache.studentStatusMap;
  }

  async getStudentStatuses() {
    await this.ensureLoaded();
    return this.cache.studentStatuses;
  }

  async getDisbursementStatusMap() {
    await this.ensureLoaded();
    return this.cache.disbursementStatuses;
  }

  async getTeacherMap() {
    await this.ensureLoaded();
    return this.cache.teachers;
  }

  async getSponsorMap() {
    await this.ensureLoaded();
    return this.cache.sponsors;
  }

  async getStudentMap() {
    await this.ensureLoaded();
    return this.cache.students;
  }

  async getBankTransactionMap() {
    await this.ensureLoaded();
    return this.cache.bankTransactions;
  }

  async getSponsorStudentMap() {
    await this.ensureLoaded();
    return this.cache.sponsorStudents;
  }
}

module.exports = new LookupService();
