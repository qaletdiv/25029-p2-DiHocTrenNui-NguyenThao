const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = 5000;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
app.use(express.json());


// Set global constant
app.set('SECRET_KEY', 'dihoctrennui-example-secret-key-2026');

const loginRoute = require('./routes/login');
const usersRoute = require('./routes/users');
const studentsRoute = require('./routes/students');

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


// Nhúng các routes ở thư mục con vào app
app.use('/login', loginRoute);
app.use('/users', authenticateToken, usersRoute);
app.use('/students', authenticateToken, studentsRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});