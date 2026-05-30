const teachersData = require('../data/teachers');
const teacherStudentsData = require('../data/teacher_students');
const studentsData = require('../data/students');
const volunteerStudentsData = require('../data/volunteer_students');
const sponsorStudentsData = require('../data/sponsor_students');

/**
 * Gets IDs of resources linked to the Teacher account.
 * Returns an object containing the list of authorized IDs for each entity.
 * 
 * @param {number} accountId - The ID of the authenticated account
 * @returns {object} An object containing: teacherId, studentIds, schoolIds, volunteerIds, sponsorIds
 */
function getTeacherLinkedResources(accountId) {
  const teacher = teachersData.find(t => t.account_id === accountId);
  if (!teacher) {
    return {
      teacherId: null,
      studentIds: [],
      schoolIds: [],
      volunteerIds: [],
      sponsorIds: []
    };
  }

  const teacherId = teacher.id;
  
  // Find linked student IDs
  const studentIds = teacherStudentsData
    .filter(rel => rel.teacher_id === teacherId)
    .map(rel => rel.student_id);

  // Find linked students and get their school IDs
  const linkedStudents = studentsData.filter(student => studentIds.includes(student.id));
  const schoolIds = [...new Set(
    linkedStudents
      .map(student => student.school_id)
      .filter(id => id !== null && id !== undefined)
  )];

  // Find linked volunteer IDs from volunteer_students
  const volunteerIds = [...new Set(
    volunteerStudentsData
      .filter(rel => studentIds.includes(rel.student_id))
      .map(rel => rel.volunteer_id)
  )];

  // Find linked sponsor IDs from sponsor_students
  const sponsorIds = [...new Set(
    sponsorStudentsData
      .filter(rel => studentIds.includes(rel.student_id))
      .map(rel => rel.sponsor_id)
  )];

  return {
    teacherId,
    studentIds,
    schoolIds,
    volunteerIds,
    sponsorIds
  };
}

module.exports = {
  getTeacherLinkedResources
};
