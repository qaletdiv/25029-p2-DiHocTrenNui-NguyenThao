const express = require('express');
const cors = require('cors');
const port = 5001;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
app.use(express.json());

// Set global constant
app.set('SECRET_KEY', 'dihoctrennui-example-secret-key-2026');

// Middlewares
const { authenticate } = require('./middlewares/authorize');
const { sendError } = require('./utils/responseHandler');

// Route Imports
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const imageRoutes = require('./routes/imageRoutes');


// Public Routes
app.use('/login', loginRoute);

// Protected Routes
app.use('/users', authenticate, userRoutes);
app.use('/students', authenticate, studentRoutes);
app.use('/sponsors', authenticate, sponsorRoutes);
app.use('/schools', authenticate, schoolRoutes);
app.use('/transactions', authenticate, transactionRoutes);
app.use('/images', authenticate, imageRoutes);


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