const StudentModel = require('../models/StudentModel');
const SponsorModel = require('../models/SponsorModel');
const TeacherModel = require('../models/TeacherModel');
const VolunteerModel = require('../models/VolunteerModel');
const SchoolModel = require('../models/SchoolModel');

const { validateStudent } = require('../validations/studentValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');

const { formatStudentResponse, parseStudentRequest } = require('../utils/formatStudent');
const { formatSponsorResponse } = require('../utils/formatSponsor');
const { formatTeacherResponse } = require('../utils/formatTeacher');
const { formatVolunteerResponse } = require('../utils/formatVolunteer');
const { formatSchoolResponse } = require('../utils/formatSchool');

const sponsorStudentsData = require('../data/sponsor_students');
const teacherStudentsData = require('../data/teacher_students');
const volunteerStudentsData = require('../data/volunteer_students');

async function getFullStudentDetail(student) {
  const formattedStudent = formatStudentResponse(student);

  // Fetch and format related school
  let schoolObj = null;
  if (student.school_id) {
    const schoolRaw = await SchoolModel.findById(student.school_id);
    if (schoolRaw) {
      schoolObj = formatSchoolResponse(schoolRaw);
    }
  }

  // Fetch and format related sponsor
  let sponsorObj = null;
  const sponsorStudentRel = sponsorStudentsData.find(rel => rel.student_id === student.id);
  if (sponsorStudentRel) {
    const sponsorRaw = await SponsorModel.findById(sponsorStudentRel.sponsor_id);
    if (sponsorRaw) {
      sponsorObj = formatSponsorResponse(sponsorRaw);
    }
  }

  // Fetch and format related teacher
  let teacherObj = null;
  const teacherStudentRel = teacherStudentsData.find(rel => rel.student_id === student.id);
  if (teacherStudentRel) {
    const teacherRaw = await TeacherModel.findById(teacherStudentRel.teacher_id);
    if (teacherRaw) {
      teacherObj = formatTeacherResponse(teacherRaw);
    }
  }

  // Fetch and format related volunteer
  let volunteerObj = null;
  const volunteerStudentRel = volunteerStudentsData.find(rel => rel.student_id === student.id);
  if (volunteerStudentRel) {
    const volunteerRaw = await VolunteerModel.findById(volunteerStudentRel.volunteer_id);
    if (volunteerRaw) {
      volunteerObj = formatVolunteerResponse(volunteerRaw);
    }
  }

  return {
    ...formattedStudent,
    school: schoolObj,
    sponsor: sponsorObj,
    teacher: teacherObj,
    volunteer: volunteerObj
  };
}

class StudentController {
  async getAllStudents(req, res) {
    try {
      const students = await StudentModel.findAll();
      let formattedStudents = students.map(formatStudentResponse);

      // Search filter (by full_name or id)
      const searchQuery = req.query.search ? req.query.search.toLowerCase().trim() : '';
      if (searchQuery) {
        formattedStudents = formattedStudents.filter(student => {
          const nameMatch = student.full_name && student.full_name.toLowerCase().includes(searchQuery);
          const idMatch = String(student.id).toLowerCase().includes(searchQuery);
          return nameMatch || idMatch;
        });
      }

      // Status filter
      const statusQuery = req.query.status ? req.query.status.trim() : '';
      if (statusQuery) {
        formattedStudents = formattedStudents.filter(student => student.status === statusQuery);
      }

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { studentIds } = getSponsorLinkedResources(req.user.id);
        formattedStudents = formattedStudents.filter(student => studentIds.includes(student.id));
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { studentIds } = getTeacherLinkedResources(req.user.id);
        formattedStudents = formattedStudents.filter(student => studentIds.includes(student.id));
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { studentIds } = getVolunteerLinkedResources(req.user.id);
        formattedStudents = formattedStudents.filter(student => studentIds.includes(student.id));
      }

      console.log("getAllStudents: \n", formattedStudents);
      return sendSuccess(res, paginate(formattedStudents, req, 'students'));
    } catch (error) {
      return sendError(res, 'Failed to fetch students', error.message);
    }
  }

  async getStudentById(req, res) {
    try {
      const student = await StudentModel.findById(req.params.id);
      if (!student) return sendError(res, 'Student not found', [], 404);

      // Sponsor restriction
      if (req.user && req.user.role_id === 4) {
        const { getSponsorLinkedResources } = require('../utils/sponsorAuth');
        const { studentIds } = getSponsorLinkedResources(req.user.id);
        if (!studentIds.includes(student.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { studentIds } = getTeacherLinkedResources(req.user.id);
        if (!studentIds.includes(student.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { studentIds } = getVolunteerLinkedResources(req.user.id);
        if (!studentIds.includes(student.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      const responseData = await getFullStudentDetail(student);

      console.log("getStudentById: \n", "Id: \n", req.params.id, "\n Student: \n", responseData);
      return sendSuccess(res, responseData);
    } catch (error) {
      return sendError(res, 'Failed to fetch student', error.message);
    }
  }

  async createStudent(req, res) {
    try {
      const parsedBody = parseStudentRequest(req.body);
      const validation = validateStudent(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      const { full_name, address, date_of_birth } = parsedBody;
      const existingStudent = await StudentModel.findByNameAndInfo(full_name, address, date_of_birth);
      if (existingStudent) {
        return sendError(res, 'Student already exists', [], 400);
      }

      const newId = await StudentModel.generateNextId();
      const newStudent = await StudentModel.create({
        id: newId,
        ...parsedBody,
        monthly_amount: parsedBody.monthly_amount || 500000,
      });


      return sendSuccess(res, formatStudentResponse(newStudent), 'Student created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create student', error.message);
    }
  }

  async updateStudent(req, res) {
    try {
      const parsedBody = parseStudentRequest(req.body);
      const validation = validateStudent(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      // Delete relation IDs from parsedBody so they are not written to the student record
      const { sponsor_id, teacher_id, volunteer_id, ...studentUpdateFields } = parsedBody;
      const updatedStudent = await StudentModel.update(req.params.id, studentUpdateFields);
      if (!updatedStudent) return sendError(res, 'Student not found', [], 404);

      // Update sponsor relation
      if (req.body.sponsor_id !== undefined) {
        const sponsorId = (req.body.sponsor_id !== null && req.body.sponsor_id !== "") ? Number(req.body.sponsor_id) : null;
        const index = sponsorStudentsData.findIndex(rel => rel.student_id === req.params.id);
        if (sponsorId !== null) {
          if (index !== -1) {
            sponsorStudentsData[index].sponsor_id = sponsorId;
            sponsorStudentsData[index].updated_at = new Date().toISOString();
          } else {
            const nextId = sponsorStudentsData.length > 0 ? Math.max(...sponsorStudentsData.map(s => s.id)) + 1 : 1;
            sponsorStudentsData.push({
              id: nextId,
              student_id: req.params.id,
              sponsor_id: sponsorId,
              monthly_amount: updatedStudent.monthly_amount || 500000,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        } else {
          if (index !== -1) {
            sponsorStudentsData.splice(index, 1);
          }
        }
      }

      // Update teacher relation
      if (req.body.teacher_id !== undefined) {
        const teacherId = (req.body.teacher_id !== null && req.body.teacher_id !== "") ? Number(req.body.teacher_id) : null;
        const index = teacherStudentsData.findIndex(rel => rel.student_id === req.params.id);
        if (teacherId !== null) {
          if (index !== -1) {
            teacherStudentsData[index].teacher_id = teacherId;
            teacherStudentsData[index].updated_at = new Date().toISOString();
          } else {
            const nextId = teacherStudentsData.length > 0 ? Math.max(...teacherStudentsData.map(s => s.id)) + 1 : 1;
            teacherStudentsData.push({
              id: nextId,
              student_id: req.params.id,
              teacher_id: teacherId,
              start_date: new Date().toISOString(),
              end_date: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        } else {
          if (index !== -1) {
            teacherStudentsData.splice(index, 1);
          }
        }
      }

      // Update volunteer relation
      if (req.body.volunteer_id !== undefined) {
        const volunteerId = (req.body.volunteer_id !== null && req.body.volunteer_id !== "") ? Number(req.body.volunteer_id) : null;
        const index = volunteerStudentsData.findIndex(rel => rel.student_id === req.params.id);
        if (volunteerId !== null) {
          if (index !== -1) {
            volunteerStudentsData[index].volunteer_id = volunteerId;
            volunteerStudentsData[index].updated_at = new Date().toISOString();
          } else {
            const nextId = volunteerStudentsData.length > 0 ? Math.max(...volunteerStudentsData.map(s => s.id)) + 1 : 1;
            volunteerStudentsData.push({
              id: nextId,
              student_id: req.params.id,
              volunteer_id: volunteerId,
              start_date: new Date().toISOString(),
              end_date: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        } else {
          if (index !== -1) {
            volunteerStudentsData.splice(index, 1);
          }
        }
      }

      const fullDetail = await getFullStudentDetail(updatedStudent);
      return sendSuccess(res, fullDetail, 'Student updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update student', error.message);
    }
  }

  async deleteStudent(req, res) {
    try {
      const success = await StudentModel.delete(req.params.id);
      if (!success) return sendError(res, 'Student not found', [], 404);

      return sendSuccess(res, null, 'Student deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete student', error.message);
    }
  }
}

module.exports = new StudentController();
