const StudentModel = require('../models/StudentModel');
const SponsorModel = require('../models/SponsorModel');
const TeacherModel = require('../models/TeacherModel');
const VolunteerModel = require('../models/VolunteerModel');
const SchoolModel = require('../models/SchoolModel');
const SponsorStudentModel = require('../models/SponsorStudentModel');
const TeacherStudentModel = require('../models/TeacherStudentModel');
const VolunteerStudentModel = require('../models/VolunteerStudentModel');

const { validateStudent } = require('../validations/studentValidation');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { paginate } = require('../utils/pagination');

const { formatStudentResponse, parseStudentRequest } = require('../utils/formatStudent');
const { formatSponsorResponse } = require('../utils/formatSponsor');
const { formatTeacherResponse } = require('../utils/formatTeacher');
const { formatVolunteerResponse } = require('../utils/formatVolunteer');
const { formatSchoolResponse } = require('../utils/formatSchool');
const lookupService = require('../utils/lookupService');

async function getFullStudentDetail(student) {
  await lookupService.ensureLoaded();
  const formattedStudent = formatStudentResponse(student);

  // Fetch and format related school
  let schoolObj = null;
  if (student.school_id) {
    const schoolRaw = await SchoolModel.findById(student.school_id);
    if (schoolRaw) {
      schoolObj = formatSchoolResponse(schoolRaw);
    }
  }

  // Fetch and format related sponsor via sponsor_students in TiDB
  let sponsorObj = null;
  const sponsorStudentRel = await SponsorStudentModel.findByStudentId(student.id);
  if (sponsorStudentRel) {
    const sponsorRaw = await SponsorModel.findById(sponsorStudentRel.sponsor_id);
    if (sponsorRaw) {
      sponsorObj = formatSponsorResponse(sponsorRaw);
    }
  }

  // Fetch and format related teacher via teacher_students in TiDB
  let teacherObj = null;
  const teacherStudentRel = await TeacherStudentModel.findByStudentId(student.id);
  if (teacherStudentRel) {
    const teacherRaw = await TeacherModel.findById(teacherStudentRel.teacher_id);
    if (teacherRaw) {
      teacherObj = formatTeacherResponse(teacherRaw);
    }
  }

  // Fetch and format related volunteer via volunteer_students in TiDB
  let volunteerObj = null;
  const volunteerStudentRel = await VolunteerStudentModel.findByStudentId(student.id);
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
    volunteer: volunteerObj,
  };
}

class StudentController {
  async getAllStudents(req, res) {
    try {
      await lookupService.ensureLoaded();
      const students = await StudentModel.findAll();
      let formattedStudents = students.map(s => formatStudentResponse(s));

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
        const { studentIds } = await getSponsorLinkedResources(req.user.id);
        formattedStudents = formattedStudents.filter(student => studentIds.includes(student.id));
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { studentIds } = await getTeacherLinkedResources(req.user.id);
        formattedStudents = formattedStudents.filter(student => studentIds.includes(student.id));
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { studentIds } = await getVolunteerLinkedResources(req.user.id);
        formattedStudents = formattedStudents.filter(student => studentIds.includes(student.id));
      }

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
        const { studentIds } = await getSponsorLinkedResources(req.user.id);
        if (!studentIds.includes(student.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Teacher restriction
      if (req.user && req.user.role_id === 3) {
        const { getTeacherLinkedResources } = require('../utils/teacherAuth');
        const { studentIds } = await getTeacherLinkedResources(req.user.id);
        if (!studentIds.includes(student.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      // Volunteer restriction
      if (req.user && req.user.role_id === 2) {
        const { getVolunteerLinkedResources } = require('../utils/volunteerAuth');
        const { studentIds } = await getVolunteerLinkedResources(req.user.id);
        if (!studentIds.includes(student.id)) {
          return sendError(res, 'Access Denied', [], 403);
        }
      }

      const responseData = await getFullStudentDetail(student);
      return sendSuccess(res, responseData);
    } catch (error) {
      return sendError(res, 'Failed to fetch student', error.message);
    }
  }

  async createStudent(req, res) {
    try {
      await lookupService.ensureLoaded();
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
      const { sponsor_id, teacher_id, volunteer_id, ...studentFields } = parsedBody;

      const newStudent = await StudentModel.create({
        id: newId,
        ...studentFields,
        monthly_amount: parsedBody.monthly_amount || 500000,
        is_active: parsedBody.is_active !== undefined ? parsedBody.is_active : true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Insert relations if provided
      if (sponsor_id) {
        const nextRelId = await SponsorStudentModel.generateNextId();
        await SponsorStudentModel.create({
          id: nextRelId,
          student_id: newId,
          sponsor_id: Number(sponsor_id),
          monthly_amount: newStudent.monthly_amount || 500000,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      if (teacher_id) {
        const nextRelId = await TeacherStudentModel.generateNextId();
        await TeacherStudentModel.create({
          id: nextRelId,
          student_id: newId,
          teacher_id: Number(teacher_id),
          start_date: new Date(),
          end_date: null,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      if (volunteer_id) {
        const nextRelId = await VolunteerStudentModel.generateNextId();
        await VolunteerStudentModel.create({
          id: nextRelId,
          student_id: newId,
          volunteer_id: Number(volunteer_id),
          start_date: new Date(),
          end_date: null,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      lookupService.invalidateCache();
      return sendSuccess(res, formatStudentResponse(newStudent), 'Student created successfully', 201);
    } catch (error) {
      return sendError(res, 'Failed to create student', error.message);
    }
  }

  async updateStudent(req, res) {
    try {
      await lookupService.ensureLoaded();
      const parsedBody = parseStudentRequest(req.body);
      const validation = validateStudent(parsedBody, true);
      if (!validation.isValid) {
        return sendError(res, 'Validation failed', validation.errors, 400);
      }

      // Delete relation IDs from parsedBody so they are not written to the student record
      const { sponsor_id, teacher_id, volunteer_id, ...studentUpdateFields } = parsedBody;
      studentUpdateFields.updated_at = new Date();

      const updatedStudent = await StudentModel.update(req.params.id, studentUpdateFields);
      if (!updatedStudent) return sendError(res, 'Student not found', [], 404);

      // Update sponsor relation in TiDB
      if (req.body.sponsor_id !== undefined) {
        const sponsorId = (req.body.sponsor_id !== null && req.body.sponsor_id !== '') ? Number(req.body.sponsor_id) : null;
        const existingRel = await SponsorStudentModel.findByStudentId(req.params.id);

        if (sponsorId !== null) {
          if (existingRel) {
            await SponsorStudentModel.update(existingRel.id, {
              sponsor_id: sponsorId,
              updated_at: new Date(),
            });
          } else {
            const nextId = await SponsorStudentModel.generateNextId();
            await SponsorStudentModel.create({
              id: nextId,
              student_id: req.params.id,
              sponsor_id: sponsorId,
              monthly_amount: updatedStudent.monthly_amount || 500000,
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        } else {
          if (existingRel) {
            await SponsorStudentModel.delete(existingRel.id);
          }
        }
      }

      // Update teacher relation in TiDB
      if (req.body.teacher_id !== undefined) {
        const teacherId = (req.body.teacher_id !== null && req.body.teacher_id !== '') ? Number(req.body.teacher_id) : null;
        const existingRel = await TeacherStudentModel.findByStudentId(req.params.id);

        if (teacherId !== null) {
          if (existingRel) {
            await TeacherStudentModel.update(existingRel.id, {
              teacher_id: teacherId,
              updated_at: new Date(),
            });
          } else {
            const nextId = await TeacherStudentModel.generateNextId();
            await TeacherStudentModel.create({
              id: nextId,
              student_id: req.params.id,
              teacher_id: teacherId,
              start_date: new Date(),
              end_date: null,
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        } else {
          if (existingRel) {
            await TeacherStudentModel.delete(existingRel.id);
          }
        }
      }

      // Update volunteer relation in TiDB
      if (req.body.volunteer_id !== undefined) {
        const volunteerId = (req.body.volunteer_id !== null && req.body.volunteer_id !== '') ? Number(req.body.volunteer_id) : null;
        const existingRel = await VolunteerStudentModel.findByStudentId(req.params.id);

        if (volunteerId !== null) {
          if (existingRel) {
            await VolunteerStudentModel.update(existingRel.id, {
              volunteer_id: volunteerId,
              updated_at: new Date(),
            });
          } else {
            const nextId = await VolunteerStudentModel.generateNextId();
            await VolunteerStudentModel.create({
              id: nextId,
              student_id: req.params.id,
              volunteer_id: volunteerId,
              start_date: new Date(),
              end_date: null,
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        } else {
          if (existingRel) {
            await VolunteerStudentModel.delete(existingRel.id);
          }
        }
      }

      lookupService.invalidateCache();
      const fullDetail = await getFullStudentDetail(updatedStudent);
      return sendSuccess(res, fullDetail, 'Student updated successfully');
    } catch (error) {
      return sendError(res, 'Failed to update student', error.message);
    }
  }

  async deleteStudent(req, res) {
    try {
      // Remove relations in TiDB first
      await Promise.all([
        SponsorStudentModel.deleteByStudentId(req.params.id),
        TeacherStudentModel.deleteByStudentId(req.params.id),
        VolunteerStudentModel.deleteByStudentId(req.params.id),
      ]);

      const success = await StudentModel.delete(req.params.id);
      if (!success) return sendError(res, 'Student not found', [], 404);

      lookupService.invalidateCache();
      return sendSuccess(res, null, 'Student deleted successfully');
    } catch (error) {
      return sendError(res, 'Failed to delete student', error.message);
    }
  }
}

module.exports = new StudentController();
