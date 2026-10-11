const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AccountModel = require('../models/AccountModel');
const StudentModel = require('../models/StudentModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @route POST /register
 * @desc Register a new user account
 * @access Public
 */
router.post('/', async (req, res) => {
    return sendError(res, 'Chức năng đăng ký tài khoản tự do đã bị vô hiệu hóa', ['Guest registration is disabled'], 403);
});

/**
 * @route POST /register/sponsor
 * @desc Register a new sponsor account with auto-generated password
 * @access Public
 */
router.post('/sponsor', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Field presence validation
        if (!username || !email || !password) {
            return sendError(res, 'Tất cả các trường là bắt buộc', ['Username, email and password are required'], 400);
        }

        // Email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendError(res, 'Định dạng email không hợp lệ', ['Invalid email format'], 400);
        }

        // Check if the submitted email already exists in the accounts list
        const existingEmail = await AccountModel.findByEmail(email);
        if (existingEmail) {
            return sendError(res, 'Registration information already exists.', ['Email is already registered'], 400);
        }

        // Also check if username exists to avoid collisions
        const existingUsername = await AccountModel.findByUsername(username);
        if (existingUsername) {
            return sendError(res, 'Username is already taken', ['Username is already taken'], 400);
        }

        // Securely hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user account to TiDB with role_id: 4 (Sponsor), is_active: false
        const nextId = await AccountModel.generateNextId();
        const newAccount = await AccountModel.create({
            id: nextId,
            username,
            email,
            password: hashedPassword,
            role_id: 4, // Sponsor
            is_active: false
        });

        // Omit password from the response
        const { password: _, ...accountWithoutPassword } = newAccount;

        return sendSuccess(res, accountWithoutPassword, 'Đăng ký tài khoản Sponsor thành công', 201);

    } catch (error) {
        return sendError(res, 'Lỗi hệ thống', error.message, 500);
    }
});

/**
 * @route POST /register/student
 * @desc Register a new student
 * @access Public
 */
router.post('/student', async (req, res) => {
    const { full_name, date_of_birth, gender, phone, address, grade, family_condition } = req.body;

    try {
        // Field presence validation
        if (!full_name || !date_of_birth || !gender || !phone || !address || !grade || !family_condition) {
            return sendError(res, 'Tất cả các trường là bắt buộc', ['All fields are required'], 400);
        }

        // Date of birth format check (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth)) {
            return sendError(res, 'Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng YYYY-MM-DD.', ['Invalid date of birth format'], 400);
        }

        // Check if student already exists in TiDB
        const existingStudent = await StudentModel.findByNameAndInfo(full_name, address, date_of_birth);
        if (existingStudent) {
            return sendError(res, 'Học sinh này đã được đăng ký trên hệ thống.', ['Student already exists'], 400);
        }

        // Generate next student ID (e.g. HSXXXX)
        const nextId = await StudentModel.generateNextId();

        // Create student record in TiDB
        const newStudent = await StudentModel.create({
            id: nextId,
            full_name,
            date_of_birth,
            gender,
            phone,
            address,
            school_id: null,
            grade: String(grade),
            family_condition,
            status_id: 1, // Default value
            monthly_amount: 500000, // Default value
            avatar_url: null,
            is_active: false,
            created_by: null,
            updated_by: null,
            created_at: new Date(),
            updated_at: null
        });

        return sendSuccess(res, newStudent, 'Đăng ký thông tin học sinh thành công', 201);

    } catch (error) {
        return sendError(res, 'Lỗi hệ thống', error.message, 500);
    }
});

module.exports = router;
