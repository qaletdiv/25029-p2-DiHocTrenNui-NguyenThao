const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserModel = require('../models/UserModel');
const ROLE_PERMISSIONS = require('../data/role_permission');
const { sendSuccess, sendError } = require('../utils/responseHandler');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Note: Using password_hash field name from our normalized data
        const user = await UserModel.findOne({ email, password_hash: password });
        
        if (user) {
            const currentUser = { id: user.id, email: user.email, role: user.role_id };
            const permissions = ROLE_PERMISSIONS[user.role_id] || [];

            const accessToken = jwt.sign(currentUser, req.app.get('SECRET_KEY'), { expiresIn: '24h' });
            
            return sendSuccess(res, { 
                accessToken, 
                user: { ...currentUser, permissions } 
            }, 'Login successful');
        } else {
            return sendError(res, 'Email hoặc mật khẩu không đúng.', [], 401);
        }
    } catch (error) {
        return sendError(res, 'Internal server error', error.message, 500);
    }
});

module.exports = router;