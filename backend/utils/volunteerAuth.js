const volunteersData = require('../data/volunteers');
const volunteerStudentsData = require('../data/volunteer_students');
const studentsData = require('../data/students');
const teacherStudentsData = require('../data/teacher_students');
const sponsorStudentsData = require('../data/sponsor_students');

/**
 * Gets IDs of resources linked to the Volunteer account.
 * Returns an object containing the list of authorized IDs for each entity.
 * 
 * @param {number} accountId - The ID of the authenticated account
 * @returns {object} An object containing: volunteerId, studentIds, schoolIds, teacherIds, sponsorIds
 */
function getVolunteerLinkedResources(accountId) {
  const volunteer = volunteersData.find(v => v.account_id === accountId);
  if (!volunteer) {
    return {
      volunteerId: null,
      studentIds: [],
      schoolIds: [],
      teacherIds: [],
      sponsorIds: []
    };
  }

  const volunteerId = volunteer.id;
  
  // Find linked student IDs
  const studentIds = volunteerStudentsData
    .filter(rel => rel.volunteer_id === volunteerId)
    .map(rel => rel.student_id);

  // Find linked students and get their school IDs
  const linkedStudents = studentsData.filter(student => studentIds.includes(student.id));
  const schoolIds = [...new Set(
    linkedStudents
      .map(student => student.school_id)
      .filter(id => id !== null && id !== undefined)
  )];

  // Find linked teacher IDs from teacher_students
  const teacherIds = [...new Set(
    teacherStudentsData
      .filter(rel => studentIds.includes(rel.student_id))
      .map(rel => rel.teacher_id)
  )];

  // Find linked sponsor IDs from sponsor_students
  const sponsorIds = [...new Set(
    sponsorStudentsData
      .filter(rel => studentIds.includes(rel.student_id))
      .map(rel => rel.sponsor_id)
  )];

  return {
    volunteerId,
    studentIds,
    schoolIds,
    teacherIds,
    sponsorIds
  };
}

module.exports = {
  getVolunteerLinkedResources
};
