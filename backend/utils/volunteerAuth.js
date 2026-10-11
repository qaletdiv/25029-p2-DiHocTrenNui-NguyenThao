const db = require('../config/db');

/**
 * Gets IDs of resources linked to the Volunteer account via TiDB direct queries.
 * Returns an object containing the list of authorized IDs for each entity.
 * 
 * @param {number} accountId - The ID of the authenticated account
 * @returns {Promise<object>} An object containing: volunteerId, studentIds, schoolIds, teacherIds, sponsorIds
 */
async function getVolunteerLinkedResources(accountId) {
  const [volunteers] = await db.query('SELECT id FROM volunteers WHERE account_id = ?', [accountId]);
  if (!volunteers || volunteers.length === 0) {
    return {
      volunteerId: null,
      studentIds: [],
      schoolIds: [],
      teacherIds: [],
      sponsorIds: [],
    };
  }

  const volunteerId = volunteers[0].id;

  // 1. Linked student IDs
  const [studentRows] = await db.query(
    'SELECT student_id FROM volunteer_students WHERE volunteer_id = ?',
    [volunteerId]
  );
  const studentIds = studentRows.map(r => r.student_id);

  if (studentIds.length === 0) {
    return {
      volunteerId,
      studentIds: [],
      schoolIds: [],
      teacherIds: [],
      sponsorIds: [],
    };
  }

  // 2. School IDs of linked students
  const [schoolRows] = await db.query(
    'SELECT DISTINCT s.school_id FROM students s JOIN volunteer_students vs ON s.id = vs.student_id WHERE vs.volunteer_id = ? AND s.school_id IS NOT NULL',
    [volunteerId]
  );
  const schoolIds = schoolRows.map(r => r.school_id);

  // 3. Teacher IDs linked through students
  const [teacherRows] = await db.query(
    'SELECT DISTINCT ts.teacher_id FROM teacher_students ts JOIN volunteer_students vs ON ts.student_id = vs.student_id WHERE vs.volunteer_id = ?',
    [volunteerId]
  );
  const teacherIds = teacherRows.map(r => r.teacher_id);

  // 4. Sponsor IDs linked through students
  const [sponsorRows] = await db.query(
    'SELECT DISTINCT ss.sponsor_id FROM sponsor_students ss JOIN volunteer_students vs ON ss.student_id = vs.student_id WHERE vs.volunteer_id = ?',
    [volunteerId]
  );
  const sponsorIds = sponsorRows.map(r => r.sponsor_id);

  return {
    volunteerId,
    studentIds,
    schoolIds,
    teacherIds,
    sponsorIds,
  };
}

module.exports = {
  getVolunteerLinkedResources,
};
