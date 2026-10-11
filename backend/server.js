require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const port = process.env.PORT || 5001;

const app = express();
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));

// Set global constant
app.set('SECRET_KEY', process.env.SECRET_KEY);

// Middlewares
const { authenticate } = require('./middlewares/authorize');
const { sendError } = require('./utils/responseHandler');

// Route Imports
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
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
app.use('/register', registerRoute);

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

// Home Route & Health Check
app.get('/', async (req, res) => {
  try {
    const isDbConnected = await db.testConnection();
    res.json({
      message: 'MVC Backend is running with TiDB!',
      database: isDbConnected ? 'Connected' : 'Disconnected',
    });
  } catch (err) {
    res.status(500).json({
      message: 'MVC Backend is running, but database connection failed!',
      error: err.message,
    });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  return sendError(res, 'Something went wrong!', err.message, 500);
});

let server = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
    try {
      await db.testConnection();
      console.log(`[TiDB] Connected successfully to host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    } catch (err) {
      console.error(`[TiDB Error] Failed to connect to database:`, err.message);
    }
  });
}

// Graceful shutdown
function handleShutdown() {
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await db.closePool();
      process.exit(0);
    });
  }
}

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);

module.exports = app;