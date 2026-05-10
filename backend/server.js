const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = 5001;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
app.use(express.json());


// Set global constant
app.set('SECRET_KEY', 'dihoctrennui-example-secret-key-2026');

const loginRoute = require('./routes/login');
const usersRoute = require('./routes/users');
const studentsRoute = require('./routes/students');


const { authenticateToken, authorize } = require('./middleware/auth');

// Demo API
app.get('/', (req, res) => {
  res.send('Hello World!');
});


// Nhúng các routes ở thư mục con vào app
app.use('/login', loginRoute);
app.use('/users', authenticateToken, usersRoute);
app.use('/students', authenticateToken, studentsRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = { app, authenticateToken, authorize };