// =========================================================================
// ARCHIVO: apps/api/src/app.ts
// DESCRIPCIÓN: Configuración principal de Express, CORS y Middlewares.
// =========================================================================

import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit"; 
import routes from "./routes/index.js";
import { errorHandler, AppError } from "./middleware/error.middleware.js";

const app = express();

// 🌐 Habilitar proxy reverso (Render / Vercel) para rate limiting e IP real
app.set("trust proxy", 1);

// ==========================================
// CONFIGURACIÓN DE CORS MULTI-ORIGEN
// ==========================================

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://medic-os-web.vercel.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : []),
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (ej. Postman, scripts del servidor, Health checks)
    if (!origin) {
      return callback(null, true);
    }

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelDomain = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);

    if (isExplicitlyAllowed || isVercelDomain) {
      callback(null, true);
    } else {
      console.warn(`⚠️ [CORS] Petición bloqueada para el origen no autorizado: ${origin}`);
      callback(new Error(`Bloqueado por CORS: El origen ${origin} no está autorizado.`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

// ==========================================
// CONFIGURACIÓN DE PROTECCIÓN ANTI-DOS
// ==========================================

// 1. Limitador general para la API (Máx 100 peticiones en 15 min por IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    ok: false,
    message: "Demasiadas peticiones desde esta dirección IP. Intenta de nuevo en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Limitador estricto para Autenticación (Máx 15 intentos en 15 min por IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    ok: false,
    message: "Demasiados intentos de autenticación. Por seguridad, inténtalo en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔒 Límite de Payload a 10kb (Evita saturar la memoria RAM con JSONs gigantes)
app.use(express.json({ limit: "10kb" }));

// Middleware para parsear req.cookies
app.use(cookieParser());

// ==========================================
// RUTAS Y RATE LIMITERS
// ==========================================

// Límite estricto para /api/auth y /auth
app.use("/api/auth", authLimiter);
app.use("/auth", authLimiter);

// Límite general para toda la /api
app.use("/api", generalLimiter);

// Rutas principales (montadas en /api y en la raíz para compatibilidad total)
app.use("/api", routes);
app.use("/", routes);

// Ruta de prueba de error operacional
app.get("/api/test-error", (_req, _res, next) => {
  next(new AppError("Prueba de error operacional en MedicOS", 400));
});

app.get("/", (_req, res) => {
  res.json({
    name: "MedicOS API",
    version: "1.0.0",
    status: "running",
  });
});

// Manejador global de errores (siempre al final)
app.use(errorHandler);

export default app;