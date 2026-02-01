const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = 5000;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
app.use(express.json());


// Set global constant
app.set('SECRET_KEY', 'dihoctrennui-example-secret-key-2026');

const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');

// Demo API
app.get('/', (req, res) => {
  res.send('Hello World!');
});


// --- Middleware xác thực ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //lấy token từ "Bearer <token>"

    if (token === null) return res.sendStatus(401); //Không có token

    jwt.verify(token, req.app.get('SECRET_KEY'), (err, user) => {
        if (err) return res.sendStatus(403); // invalid token
        req.user = user;
        next();
    })
}

// app.post('/login', (req, res) => {
//     console.log(req);
//     const { email, password } = req.body;
//     //kiểm tra email có tồn tại không
//     const user = usersList.find(user => (user.email === email && user.password === password));
//     if (user) {
//         // { id: 'TNV0001', name: "Vu Lien", email: "lien@gmail.com", password: "123456", phone: "0905222222", role: "volunteer", status: 'active' }
//         const currentUser = {id: user.id, email: user.email, role: user.role};
//         const accessToken = jwt.sign(currentUser, SECRET_KEY, {expriseIn: '5h'});
//         res.json(accessToken);
//     } else {
//         res.status(401).send('Email hoặc mật khẩu không đúng.');
//     }
// })

// Nhúng các routes ở thư mục con vào app
app.use('/login', loginRoute);
app.use('/users', authenticateToken, usersRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});