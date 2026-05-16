const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const AccountModel = require('../models/AccountModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await AccountModel.findOne({ email, password });
        
        if (user) {
            const currentUser = { id: user.id, email: user.email, role_id: user.role_id, username: user.username };
            
            // Fetch permissions for this role
            const permissions = require('../data/permissions');
            const rolePermissions = require('../data/role_permission');
            const userPermissionIds = rolePermissions
                .filter(rp => rp.role_id === user.role_id)
                .map(rp => rp.permission_id);
            const userPermissions = permissions.filter(p => userPermissionIds.includes(p.id));

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