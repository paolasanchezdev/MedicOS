// =========================================================================
// ARCHIVO: apps/api/src/app.ts
// DESCRIPCIÓN: Configuración principal de Express, CORS, Seguridad y Middlewares.
// =========================================================================

import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit"; 
import routes from "./routes/index.js";
import { errorHandler, AppError } from "./middleware/error.middleware.js";

const app = express();

// 🌐 Habilitar proxy reverso (Render / Vercel / Nginx) para rate limiting e IP real
app.set("trust proxy", 1);

// ==========================================
// SEGURIDAD DE CABECERAS HTTP (HELMET)
// ==========================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// ==========================================
// REGISTRO DE PETICIONES (LOGGING)
// ==========================================
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

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
    // Permitir peticiones sin origen (Postman, scripts locales, health checks internos)
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
// PARSERS DE CUERPO Y COOKIES
// ==========================================
// Límite de payload a 10kb para mitigar saturación de memoria RAM
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ==========================================
// CONFIGURACIÓN DE PROTECCIÓN ANTI-DOS (RATE LIMITERS)
// ==========================================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 100,
  message: {
    ok: false,
    message: "Demasiadas peticiones desde esta dirección IP. Intenta de nuevo en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 100 : 15,
  message: {
    ok: false,
    message: "Demasiados intentos de autenticación. Por seguridad, inténtalo en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// RUTAS Y CONTROL DE TRÁFICO
// ==========================================
app.use("/api/auth", authLimiter);
app.use("/auth", authLimiter);
app.use("/api", generalLimiter);

// Endpoint de verificación raíz
app.get("/", (_req, res) => {
  res.json({
    name: "MedicOS API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// Endpoint de prueba de error operacional
app.get("/api/test-error", (_req, _res, next) => {
  next(new AppError("Prueba de error operacional en MedicOS", 400));
});

// Montaje principal de rutas API
app.use("/api", routes);
app.use("/", routes);

// Captura de rutas no encontradas (404)
app.use("*", (req, _res, next) => {
  next(new AppError(`No se encontró la ruta ${req.originalUrl} en el servidor`, 404));
});

// ==========================================
// MANEJADOR GLOBAL DE ERRORES
// ==========================================
app.use(errorHandler);

export default app;