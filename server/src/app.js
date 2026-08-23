import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();
console.log(">>> NEW GYANEXIA APP.JS LOADED <<<");
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON requests
app.use(express.json({ limit: "10kb" }));

// Parse cookies
app.use(cookieParser());

// Rate limiting for API routes
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      message: "Too many requests. Please try again later.",
    },
  })
);

// Health check
app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Handle unknown routes
app.use((_request, response) => {
  response.status(404).json({
    message: "Route not found.",
  });
});

// Global error handler
app.use((error, _request, response, _next) => {
  console.error(error);

  // MongoDB duplicate key error
  if (error?.code === 11000) {
    return response.status(409).json({
      message: "An account with this mobile number already exists.",
    });
  }

  // Mongoose validation error
  if (error?.name === "ValidationError") {
    return response.status(400).json({
      message: error.message,
    });
  }

  // Mongoose cast error
  if (error?.name === "CastError") {
    return response.status(400).json({
      message: "Invalid request data.",
    });
  }

  return response.status(error?.statusCode || 500).json({
    message: error?.message || "An unexpected server error occurred.",
  });
});

export default app;