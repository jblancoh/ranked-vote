import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();

// Import routes
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { extractTenantMiddleware } from "./middleware/tenant.vercel.js";
import { specs, swaggerUi, swaggerUiOptions } from "./config/swagger.config.js";

const app = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "localhost";
const NODE_ENV = process.env.NODE_ENV || "development";

app.set("trust proxy", 1);
// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Parse CORS_ORIGIN which can contain multiple domains separated by comma
    const corsOriginEnv = process.env.CORS_ORIGIN || "";
    const corsOriginList = corsOriginEnv
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      ...corsOriginList,
    ];

    const isAllowed =
      allowedOrigins.indexOf(origin) !== -1 || NODE_ENV === "development";

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`CORS blocked request from origin: ${origin}`);
      console.error(`Allowed origins: ${allowedOrigins.join(", ")}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Tenant-Slug",
    "X-Tenant-Id",
  ],
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: "Demasiadas solicitudes desde esta IP, por favor intenta más tarde.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check endpoint (no tenant required)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Ranked Vote API is running",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    multiTenant: true,
  });
});

// Swagger Documentation (no tenant required)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

// Tenant middleware (extract tenant from request)
// This runs BEFORE all API routes
app.use("/api", extractTenantMiddleware);

// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server - Only listen in development or if PORT is defined
let server;
if (NODE_ENV !== "production" || process.env.PORT) {
  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`
  🗳️  Ranked Vote API Server (Multi-Tenant)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Environment: ${NODE_ENV}
  Server running on port: ${PORT}
  Health check: http://${HOST}:${PORT}/health
  API Documentation: http://${process.env.HOST || "localhost"}:${PORT}/api-docs
  API Base URL: http://${HOST}:${PORT}/api
  Default Tenant: ${process.env.DEFAULT_TENANT || "default"}
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Multi-tenant enabled!
  Use header: X-Tenant-Slug: default
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
  });

  // Graceful shutdown for Render
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
} else {
  console.log(`
  🗳️  Ranked Vote API Server (Multi-Tenant)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Environment: ${NODE_ENV}
  ⚠️  No PORT defined - server not listening
  App ready to be used as middleware
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

export default app;
