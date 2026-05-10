const ROLE_PERMISSIONS = require('../data/role_permission');
const jwt = require('jsonwebtoken');

// --- Middleware xác thực ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //lấy token từ "Bearer <token>"

    if (token === null) return res.sendStatus(401); //Không có token

    jwt.verify(token, req.app.get('SECRET_KEY'), (err, user) => {
        if (err) return res.sendStatus(403); // invalid token
        req.user = user;
        // Attach permissions to request based on role
        req.permissions = ROLE_PERMISSIONS[user.role] || [];
        next();
    })
}
// Middleware: Authorize Permission
const authorize = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.permissions || !req.permissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorize };