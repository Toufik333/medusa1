const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const { initPostgres } = require('./db/initDb');

const productRoutes = require('./routes/productRoutes');
const couponRoutes = require('./routes/couponRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// 1. CORS Configuration for Vercel Frontend and local testing
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin || allowedOrigin === '*' || origin === allowedOrigin) {
      return callback(null, true);
    }
    // Allow vercel preview / production URLs
    if (origin.includes('.vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Body Parser (15MB limit to easily handle 4:5 cropped canvas images)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// 3. API Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db.isPostgres() ? 'PostgreSQL (Active)' : 'In-Memory / Fallback Mode (Demo Data)',
    features: {
      cashOnDelivery: 'ACTIVE',
      bkashGatewaySlot: 'RESERVED',
      clothingConditionalSizes: 'ACTIVE',
      uniform4x5Cropper: 'ACTIVE'
    }
  });
});

// 4. Mount API Routes
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// Initialize Database on Startup & Listen
async function startServer() {
  if (db.isPostgres()) {
    await initPostgres();
  }
  
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Store Backend running on port ${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`📦 Database: ${db.isPostgres() ? 'PostgreSQL (Connected)' : 'In-Memory Mode (Demo Preloaded)'}`);
    console.log(`💳 Payments: Cash on Delivery [Active] | bKash [Reserved]`);
    console.log(`=======================================================`);
  });
}

startServer();
