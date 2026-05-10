const express = require('express');
const cors = require('cors');
const port = 5001;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
app.use(express.json());

// Set global constant
app.set('SECRET_KEY', 'dihoctrennui-example-secret-key-2026');

// Middlewares
const { authenticateToken } = require('./middleware/auth');
const { sendError } = require('./utils/responseHandler');

// Route Imports
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/userRoutes');
// const studentsRoute = require('./routes/students'); // Keep old one or refactor later

// Public Routes
app.use('/login', loginRoute);

// Protected Routes
app.use('/users', authenticateToken, userRoutes);

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