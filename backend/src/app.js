import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { extractTenantMiddleware } from './middleware/tenant.vercel.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.CORS_ORIGIN
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Slug', 'X-Tenant-Id']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint (no tenant required)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Ranked Vote API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    multiTenant: true
  });
});

// Tenant middleware (extract tenant from request)
// This runs BEFORE all API routes
app.use('/api', extractTenantMiddleware);

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
  🗳️  Ranked Vote API Server (Multi-Tenant)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Environment: ${process.env.NODE_ENV || 'development'}
  Server running on: http://${process.env.HOST || 'localhost'}:${PORT}
  Health check: http://${process.env.HOST || 'localhost'}:${PORT}/health
  API Base URL: http://${process.env.HOST || 'localhost'}:${PORT}/api
  Default Tenant: ${process.env.DEFAULT_TENANT || 'default'}
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Multi-tenant enabled!
  Use header: X-Tenant-Slug: default
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export default app;