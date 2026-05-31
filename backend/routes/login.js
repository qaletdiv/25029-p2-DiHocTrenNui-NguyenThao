const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const AccountModel = require('../models/AccountModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const bcrypt = require('bcryptjs');
        const user = await AccountModel.findByUsername(username);
        
        let isValidPassword = false;
        if (user) {
            // Support both bcrypt-hashed passwords and plaintext passwords (for seeding or backward compatibility)
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                isValidPassword = await bcrypt.compare(password, user.password);
            } else {
                isValidPassword = user.password === password;
            }
        }
        
        if (user && isValidPassword) {
            const currentUser = { id: user.id, username: user.username, role_id: user.role_id, email: user.email };
            
            const permissions = require('../data/permissions');
            const rolePermissions = require('../data/role_permission');
            const userPermissionIds = rolePermissions
                .filter(rp => rp.role_id === user.role_id)
                .map(rp => rp.permission_id);
            const userPermissions = permissions
                .filter(p => userPermissionIds.includes(p.id))
                .map(p => p.code);

            const accessToken = jwt.sign(currentUser, req.app.get('SECRET_KEY'), { expiresIn: '24h' });
            
            return sendSuccess(res, { 
                accessToken, 
                user: { ...currentUser, permissions: userPermissions } 
            }, 'Login successful');
        } else {
            return sendError(res, 'Tên đăng nhập hoặc mật khẩu không đúng.', [], 401);
        }

    } catch (error) {
        return sendError(res, 'Internal server error', error.message, 500);
    }
});

module.exports = router;