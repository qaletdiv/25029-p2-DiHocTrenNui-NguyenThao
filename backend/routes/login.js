const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const usersList = require('./../data/users');
const ROLE_PERMISSIONS = require('./../data/role_permissions');

router.post('/', (req, res) => {
    const { email, password } = req.body;

    const user = usersList.find(user => (user.email === email && user.password === password));
    if (user) {
        const currentUser = { id: user.id, email: user.email, role: user.role };
        const permissions = ROLE_PERMISSIONS[user.role] || [];

        const accessToken = jwt.sign(currentUser, req.app.get('SECRET_KEY'), { expiresIn: '24h' });
        res.json({ accessToken, user: { ...currentUser, permissions } });
    } else {
        res.status(401).send('Email hoặc mật khẩu không đúng.');
    }
})

module.exports = router;