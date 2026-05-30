const sponsorsData = require('../data/sponsors');
const sponsorStudentsData = require('../data/sponsor_students');
const studentsData = require('../data/students');
const volunteerStudentsData = require('../data/volunteer_students');
const teacherStudentsData = require('../data/teacher_students');

/**
 * Gets IDs of resources linked to the Sponsor account.
 * Returns an object containing the list of authorized IDs for each entity.
 * 
 * @param {number} accountId - The ID of the authenticated account
 * @returns {object} An object containing: sponsorId, studentIds, schoolIds, volunteerIds, teacherIds
 */
function getSponsorLinkedResources(accountId) {
  const sponsor = sponsorsData.find(s => s.account_id === accountId);
  if (!sponsor) {
    return {
      sponsorId: null,
      studentIds: [],
      schoolIds: [],
      volunteerIds: [],
      teacherIds: []
    };
  }

  const sponsorId = sponsor.id;
  
  // Find linked student IDs
  const studentIds = sponsorStudentsData
    .filter(rel => rel.sponsor_id === sponsorId)
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

  // Find linked teacher IDs from teacher_students
  const teacherIds = [...new Set(
    teacherStudentsData
      .filter(rel => studentIds.includes(rel.student_id))
      .map(rel => rel.teacher_id)
  )];

  return {
    sponsorId,
    studentIds,
    schoolIds,
    volunteerIds,
    teacherIds
  };
}

module.exports = {
  getSponsorLinkedResources
};
