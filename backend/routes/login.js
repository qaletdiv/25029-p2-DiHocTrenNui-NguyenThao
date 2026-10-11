const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AccountModel = require('../models/AccountModel');
const PermissionModel = require('../models/PermissionModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await AccountModel.findByEmail(email);
        
        let isValidPassword = false;
        if (user) {
            // Support both bcrypt-hashed passwords and plaintext passwords (for seeding or backward compatibility)
            if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
                isValidPassword = await bcrypt.compare(password, user.password);
            } else {
                isValidPassword = user.password === password;
            }
        }
        
        if (user && isValidPassword) {
            const currentUser = { id: user.id, username: user.username, role_id: user.role_id, email: user.email };
            
            // Query user permissions directly from TiDB
            const userPermissions = await PermissionModel.getPermissionCodesByRoleId(user.role_id);

            const accessToken = jwt.sign(currentUser, req.app.get('SECRET_KEY'), { expiresIn: '24h' });
            
            return sendSuccess(res, { 
                accessToken, 
                user: { ...currentUser, permissions: userPermissions } 
            }, 'Login successful');
        } else {
            return sendError(res, 'Email hoặc mật khẩu không đúng.', [], 401);
        }

    } catch (error) {
        return sendError(res, 'Internal server error', error.message, 500);
    }
});

module.exports = router;