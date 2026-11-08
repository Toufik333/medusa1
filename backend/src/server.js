const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./config/db');
const { initPostgres } = require('./db/initDb');
const { getAdminsFromEnv } = require('./config/auth');
const { sanitizeInput } = require('./middleware/security');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const couponRoutes = require('./routes/couponRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Trust reverse proxy (essential for Heroku and HTTPS detection)
app.set('trust proxy', 1);

// 1. Force HTTPS in Production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}

// 2. HTTP Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: false, // CSP configured per client deployment
  crossOriginEmbedderPolicy: false
}));

// 3. CORS Policy
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigin === '*' || origin === allowedOrigin) {
      return callback(null, true);
    }
    if (origin.includes('.vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 4. Rate Limiting (Anti-Brute Force & Bot Protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts from this IP. Please try again after 15 minutes.' }
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Max 30 orders per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Order limit reached. Please wait before placing additional orders.' }
});

// 5. Body Parsers & Input Sanitization
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(sanitizeInput);

// 6. API Healthcheck (Safe Public Projection)
app.get('/api/health', (req, res) => {
  const admins = getAdminsFromEnv();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db.isPostgres() ? 'PostgreSQL (Active)' : 'In-Memory / Fallback Mode',
    security: {
      httpsEnforced: process.env.NODE_ENV === 'production',
      rateLimiting: 'ACTIVE',
      inputSanitization: 'ACTIVE',
      jwtProtection: 'ACTIVE'
    }
  });
});

// 7. Mount Protected & Rate-limited Routes
app.use('/api/admin', loginLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/payments', paymentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: 'An unexpected internal error occurred' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (db.isPostgres()) {
    await initPostgres();
  }

  const admins = getAdminsFromEnv();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Store Backend running on port ${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`🛡️  Security: Helmet Headers & Rate Limiting ACTIVE`);
    console.log(`🔐 Admin Auth: ${admins.length} authorized admin(s) loaded`);
    console.log(`=======================================================`);
  });
}

startServer();
