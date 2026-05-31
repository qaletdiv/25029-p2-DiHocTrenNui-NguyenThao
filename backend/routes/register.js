const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AccountModel = require('../models/AccountModel');
const ROLES = require('../data/roles');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @route POST /register
 * @desc Register a new user account
 * @access Public
 */
router.post('/', async (req, res) => {
    const { username, email, password, role_id } = req.body;

    try {
        // Field presence validation
        if (!username || !email || !password || !role_id) {
            return sendError(res, 'Tất cả các trường là bắt buộc', ['Username, email, password, and role_id are required'], 400);
        }

        // Email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendError(res, 'Định dạng email không hợp lệ', ['Invalid email format'], 400);
        }

        // Uniqueness validation - Username
        const existingUsername = await AccountModel.findByUsername(username);
        if (existingUsername) {
            return sendError(res, 'Username is already taken', ['Username is already taken'], 400);
        }

        // Uniqueness validation - Email
        const existingEmail = await AccountModel.findByEmail(email);
        if (existingEmail) {
            return sendError(res, 'Email is already registered', ['Email is already registered'], 400);
        }

        // Role validation
        const parsedRoleId = parseInt(role_id, 10);
        const roleExists = ROLES.some(r => r.id === parsedRoleId);
        if (!roleExists) {
            return sendError(res, 'Invalid role selected', ['Invalid role selected'], 400);
        }

        // Securely hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user account to the database
        const nextId = await AccountModel.generateNextId();
        const newAccount = await AccountModel.create({
            id: nextId,
            username,
            email,
            password: hashedPassword,
            role_id: parsedRoleId,
            is_active: true
        });

        // Omit password from the response
        const { password: _, ...accountWithoutPassword } = newAccount;

        return sendSuccess(res, accountWithoutPassword, 'Đăng ký tài khoản thành công', 201);

    } catch (error) {
        return sendError(res, 'Lỗi hệ thống', error.message, 500);
    }
});

module.exports = router;
