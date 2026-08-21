// apps/api/src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit"; 
import routes from "./routes/index.js";
import { errorHandler, AppError } from "./middleware/error.middleware.js";

const app = express();

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

// 2. Limitador estricto para Autenticación (Máx 10 intentos en 15 min por IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    ok: false,
    message: "Demasiados intentos de autenticación. Por seguridad, inténtalo en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// MIDDLEWARES BASE
// ==========================================

// CORS para permitir cookies HttpOnly
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

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