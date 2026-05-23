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

class StudentController {
  async getAllStudents(req, res) {
    try {
      const students = await StudentModel.findAll();
      const formattedStudents = students.map(formatStudentResponse);
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

      const responseData = {
        ...formattedStudent,
        school: schoolObj,
        sponsor: sponsorObj,
        teacher: teacherObj,
        volunteer: volunteerObj
      };

      console.log("getStudentById: \n", "Id: \n", req.params.id, "\n Student: \n", responseData);
      return sendSuccess(res, responseData);
    } catch (error) {
      return sendError(res, 'Failed to fetch student', error.message);
    }
  }

  async createStudent(req, res) {
    try {
      const parsedBody = parseStudentRequest(req.body);
      const validation = validateStudent(parsedBody);
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

      const updatedStudent = await StudentModel.update(req.params.id, parsedBody);
      if (!updatedStudent) return sendError(res, 'Student not found', [], 404);

      return sendSuccess(res, formatStudentResponse(updatedStudent), 'Student updated successfully');
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
