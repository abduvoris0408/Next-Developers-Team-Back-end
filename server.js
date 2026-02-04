require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const swaggerDocs = require('./config/swagger');

// Route files
const authRoutes = require('./routes/auth');
const featuresRoutes = require('./routes/features');
const productsRoutes = require('./routes/products');
const teamRoutes = require('./routes/team');
const technologiesRoutes = require('./routes/technologies');
const awardsRoutes = require('./routes/awards');
const testimonialsRoutes = require('./routes/testimonials');
const contactsRoutes = require('./routes/contacts');
const attendanceRoutes = require('./routes/attendance');
const dashboardRoutes = require('./routes/dashboard');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Sanitize data
app.use(mongoSanitize());

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Juda ko\'p so\'rovlar yuborildi, keyinroq urinib ko\'ring',
});
app.use('/api/', limiter);

// Set static folder
app.use(express.static('public'));

// Swagger Documentation
swaggerDocs(app);

// Mount routes
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/features`, featuresRoutes);
app.use(`${API_VERSION}/products`, productsRoutes);
app.use(`${API_VERSION}/team`, teamRoutes);
app.use(`${API_VERSION}/technologies`, technologiesRoutes);
app.use(`${API_VERSION}/awards`, awardsRoutes);
app.use(`${API_VERSION}/testimonials`, testimonialsRoutes);
app.use(`${API_VERSION}/contacts`, contactsRoutes);
app.use(`${API_VERSION}/attendance`, attendanceRoutes);
app.use(`${API_VERSION}/dashboard`, dashboardRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Software Company API ishlamoqda!',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      features: `${API_VERSION}/features`,
      products: `${API_VERSION}/products`,
      team: `${API_VERSION}/team`,
      technologies: `${API_VERSION}/technologies`,
      awards: `${API_VERSION}/awards`,
      testimonials: `${API_VERSION}/testimonials`,
      contacts: `${API_VERSION}/contacts`,
      attendance: `${API_VERSION}/attendance`,
      dashboard: `${API_VERSION}/dashboard`,
      auth: `${API_VERSION}/auth`,
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route topilmadi',
    path: req.path,
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Server ishga tushdi!                            ║
║   📡 Port: ${PORT}                                    ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║   📚 API: http://localhost:${PORT}${API_VERSION}             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
