const db = require('../config/db');

/**
 * Gets IDs of resources linked to the Teacher account via TiDB direct queries.
 * Returns an object containing the list of authorized IDs for each entity.
 * 
 * @param {number} accountId - The ID of the authenticated account
 * @returns {Promise<object>} An object containing: teacherId, studentIds, schoolIds, volunteerIds, sponsorIds
 */
async function getTeacherLinkedResources(accountId) {
  const [teachers] = await db.query('SELECT id, school_id FROM teachers WHERE account_id = ?', [accountId]);
  if (!teachers || teachers.length === 0) {
    return {
      teacherId: null,
      studentIds: [],
      schoolIds: [],
      volunteerIds: [],
      sponsorIds: [],
    };
  }

  const teacher = teachers[0];
  const teacherId = teacher.id;

  // 1. Linked student IDs
  const [studentRows] = await db.query(
    'SELECT student_id FROM teacher_students WHERE teacher_id = ?',
    [teacherId]
  );
  const studentIds = studentRows.map(r => r.student_id);

  if (studentIds.length === 0) {
    return {
      teacherId,
      studentIds: [],
      schoolIds: teacher.school_id ? [teacher.school_id] : [],
      volunteerIds: [],
      sponsorIds: [],
    };
  }

  // 2. School IDs (including teacher's assigned school and linked students' schools)
  const [schoolRows] = await db.query(
    'SELECT DISTINCT s.school_id FROM students s JOIN teacher_students ts ON s.id = ts.student_id WHERE ts.teacher_id = ? AND s.school_id IS NOT NULL',
    [teacherId]
  );
  const schoolIds = [...new Set([
    ...(teacher.school_id ? [teacher.school_id] : []),
    ...schoolRows.map(r => r.school_id),
  ])];

  // 3. Volunteer IDs linked through students
  const [volunteerRows] = await db.query(
    'SELECT DISTINCT vs.volunteer_id FROM volunteer_students vs JOIN teacher_students ts ON vs.student_id = ts.student_id WHERE ts.teacher_id = ?',
    [teacherId]
  );
  const volunteerIds = volunteerRows.map(r => r.volunteer_id);

  // 4. Sponsor IDs linked through students
  const [sponsorRows] = await db.query(
    'SELECT DISTINCT ss.sponsor_id FROM sponsor_students ss JOIN teacher_students ts ON ss.student_id = ts.student_id WHERE ts.teacher_id = ?',
    [teacherId]
  );
  const sponsorIds = sponsorRows.map(r => r.sponsor_id);

  return {
    teacherId,
    studentIds,
    schoolIds,
    volunteerIds,
    sponsorIds,
  };
}

module.exports = {
  getTeacherLinkedResources,
};
