const db = require('../config/db');

/**
 * Gets IDs of resources linked to the Sponsor account via TiDB direct queries.
 * Returns an object containing the list of authorized IDs for each entity.
 * 
 * @param {number} accountId - The ID of the authenticated account
 * @returns {Promise<object>} An object containing: sponsorId, studentIds, schoolIds, volunteerIds, teacherIds
 */
async function getSponsorLinkedResources(accountId) {
  const [sponsors] = await db.query('SELECT id FROM sponsors WHERE account_id = ?', [accountId]);
  if (!sponsors || sponsors.length === 0) {
    return {
      sponsorId: null,
      studentIds: [],
      schoolIds: [],
      volunteerIds: [],
      teacherIds: [],
    };
  }

  const sponsorId = sponsors[0].id;

  // 1. Linked student IDs
  const [studentRows] = await db.query(
    'SELECT student_id FROM sponsor_students WHERE sponsor_id = ?',
    [sponsorId]
  );
  const studentIds = studentRows.map(r => r.student_id);

  if (studentIds.length === 0) {
    return {
      sponsorId,
      studentIds: [],
      schoolIds: [],
      volunteerIds: [],
      teacherIds: [],
    };
  }

  // 2. School IDs of linked students
  const [schoolRows] = await db.query(
    'SELECT DISTINCT s.school_id FROM students s JOIN sponsor_students ss ON s.id = ss.student_id WHERE ss.sponsor_id = ? AND s.school_id IS NOT NULL',
    [sponsorId]
  );
  const schoolIds = schoolRows.map(r => r.school_id);

  // 3. Volunteer IDs linked through students
  const [volunteerRows] = await db.query(
    'SELECT DISTINCT vs.volunteer_id FROM volunteer_students vs JOIN sponsor_students ss ON vs.student_id = ss.student_id WHERE ss.sponsor_id = ?',
    [sponsorId]
  );
  const volunteerIds = volunteerRows.map(r => r.volunteer_id);

  // 4. Teacher IDs linked through students
  const [teacherRows] = await db.query(
    'SELECT DISTINCT ts.teacher_id FROM teacher_students ts JOIN sponsor_students ss ON ts.student_id = ss.student_id WHERE ss.sponsor_id = ?',
    [sponsorId]
  );
  const teacherIds = teacherRows.map(r => r.teacher_id);

  return {
    sponsorId,
    studentIds,
    schoolIds,
    volunteerIds,
    teacherIds,
  };
}

module.exports = {
  getSponsorLinkedResources,
};
