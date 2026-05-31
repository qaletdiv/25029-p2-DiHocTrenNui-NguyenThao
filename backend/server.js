require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT;

const app = express();
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.json({ limit: '10mb' }));

// Set global constant
app.set('SECRET_KEY', process.env.SECRET_KEY);

// Middlewares
const { authenticate } = require('./middlewares/authorize');
const { sendError } = require('./utils/responseHandler');

// Route Imports
const loginRoute = require('./routes/login');
const accountRoutes = require('./routes/accountRoutes');
const studentRoutes = require('./routes/studentRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const bankTransactionRoutes = require('./routes/bankTransactionRoutes');
const imageRoutes = require('./routes/imageRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const disbursementRoutes = require('./routes/disbursementRoutes');


// Public Routes
app.use('/login', loginRoute);

// Protected Routes
app.use('/accounts', authenticate, accountRoutes);
app.use('/students', authenticate, studentRoutes);
app.use('/sponsors', authenticate, sponsorRoutes);
app.use('/schools', authenticate, schoolRoutes);
app.use('/bank-transactions', authenticate, bankTransactionRoutes);
app.use('/images', authenticate, imageRoutes);
app.use('/teachers', authenticate, teacherRoutes);
app.use('/volunteers', authenticate, volunteerRoutes);
app.use('/disbursements', authenticate, disbursementRoutes);


// Home Route
app.get('/', (req, res) => {
  res.send('MVC Backend is running!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  return sendError(res, 'Something went wrong!', err.message, 500);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;