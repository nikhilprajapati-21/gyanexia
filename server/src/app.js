import "dotenv/config";

import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import studentCompetitionRoutes from "./routes/studentCompetitionRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";

const app = express();

console.log(">>> GYANEXIA APP.JS LOADED <<<");

app.set("trust proxy", 1);


/*
 * ==========================================
 * SECURITY HEADERS
 * ==========================================
 */

app.use(helmet());


/*
 * ==========================================
 * CORS
 * ==========================================
 */

const configuredOrigins = (
  process.env.CLIENT_ORIGIN || ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const productionOrigins = [
  "https://www.gyanexia.in",
  "https://gyanexia.in",
];

const localOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:3000",
        "http://localhost:3001",
      ];

const allowedOrigins = [
  ...new Set([
    ...productionOrigins,
    ...configuredOrigins,
    ...localOrigins,
  ]),
];

console.log(
  "Allowed CORS origins:",
  allowedOrigins
);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
       * Allow requests without an Origin header.
       * Useful for Postman and server-to-server requests.
       */

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error(
          `Origin ${origin} is not allowed by CORS.`
        )
      );
    },

    /*
     * VERY IMPORTANT FOR LOGIN COOKIES
     */

    credentials: true,

    optionsSuccessStatus: 204,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


/*
 * ==========================================
 * BODY PARSING
 * ==========================================
 */

app.use(
  express.json({
    limit: "10kb",
  })
);


/*
 * ==========================================
 * COOKIE PARSER
 * ==========================================
 */

app.use(cookieParser());


/*
 * ==========================================
 * RATE LIMITING
 * ==========================================
 */

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 300,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    message: {
      message:
        "Too many requests. Please try again later.",
    },
  })
);


/*
 * ==========================================
 * HEALTH CHECK
 * ==========================================
 */

app.get(
  "/api/health",
  (_request, response) => {
    response.status(200).json({
      status: "ok",
    });
  }
);


/*
 * ==========================================
 * API ROUTES
 * ==========================================
 */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/registrations",
  registrationRoutes
);

app.use(
  "/api/competitions",
  competitionRoutes
);

app.use(
  "/api/student/competitions",
  studentCompetitionRoutes
);

app.use(
  "/api/results",
  resultRoutes
);

app.use(
  "/api/queries",
  queryRoutes
);


/*
 * ==========================================
 * UNKNOWN ROUTES
 * ==========================================
 */

app.use(
  (_request, response) => {
    response.status(404).json({
      message: "Route not found.",
    });
  }
);


/*
 * ==========================================
 * GLOBAL ERROR HANDLER
 * ==========================================
 */

app.use(
  (
    error,
    _request,
    response,
    _next
  ) => {
    console.error(error);


    /*
     * MongoDB duplicate key
     */

    if (error?.code === 11000) {
      return response
        .status(409)
        .json({
          message:
            "An account with this mobile number already exists.",
        });
    }


    /*
     * Mongoose validation
     */

    if (
      error?.name ===
      "ValidationError"
    ) {
      return response
        .status(400)
        .json({
          message:
            error.message,
        });
    }


    /*
     * Mongoose cast error
     */

    if (
      error?.name ===
      "CastError"
    ) {
      return response
        .status(400)
        .json({
          message:
            "Invalid request data.",
        });
    }


    /*
     * CORS error
     */

    if (
      error?.message &&
      error.message.includes(
        "not allowed by CORS"
      )
    ) {
      return response
        .status(403)
        .json({
          message:
            "This origin is not allowed by CORS.",
        });
    }


    /*
     * GENERAL ERROR
     */

    return response
      .status(
        error?.statusCode || 500
      )
      .json({
        message:
          error?.message ||
          "An unexpected server error occurred.",
      });
  }
);


export default app;