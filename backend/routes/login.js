const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router(); //router này sẽ kế thừa middleware từ app chính khi được import

const usersList = require('./../data/users');

router.get('/', (req, res) => {
    res.send('Login API test!');
});

router.post('/', (req, res) => {
    console.log(req);
    const { email, password } = req.body;
    //kiểm tra email có tồn tại không
    const user = usersList.find(user => (user.email === email && user.password === password));
    if (user) {
        // { id: 'TNV0001', name: "Vu Lien", email: "lien@gmail.com", password: "123456", phone: "0905222222", role: "volunteer", status: 'active' }
        const currentUser = {id: user.id, email: user.email, role: user.role};
        const accessToken = jwt.sign(currentUser, req.app.get('SECRET_KEY'), {expiresIn: '5h'});
        res.json(accessToken);
    } else {
        res.status(401).send('Email hoặc mật khẩu không đúng.');
    }
})

module.exports = router;