
// =========================================================================
// ARCHIVO: apps/api/src/app.ts
// DESCRIPCIÓN: Configuración principal de Express, CORS, Seguridad,
//              Middlewares y servidor web local para Modo Estación.
// =========================================================================

import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import {
  errorHandler,
  AppError,
} from "./middleware/error.middleware.js";

// =========================================================================
// CONFIGURACIÓN BASE
// =========================================================================

const app = express();

// =========================================================================
// RUTAS DEL SISTEMA DE ARCHIVOS
// =========================================================================
//
// En desarrollo:
//
//   apps/api/src/app.ts
//   apps/web/dist
//
// En producción compilado:
//
//   apps/api/dist/app.js
//   apps/web/dist
//
// Por eso resolvemos la ruta dinámicamente desde el archivo actual.
// =========================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webDistPath = path.resolve(
  __dirname,
  "../../web/dist"
);

const isStationMode =
  process.env.STATION_MODE === "true";

// =========================================================================
// 🌐 PROXY REVERSO
// =========================================================================
//
// Compatible con Render / Vercel / Nginx y con la Raspberry.
// =========================================================================

app.set("trust proxy", 1);

// =========================================================================
// SEGURIDAD DE CABECERAS HTTP
// =========================================================================
//
// En modo estación MedicOS se sirve mediante HTTP dentro de la red local:
//
//   http://10.42.0.1:3000
//
// Por eso NO debemos forzar HTTPS en este modo.
//
// Se mantienen las demás protecciones de Helmet.
// =========================================================================

const helmetOptions = {
  crossOriginResourcePolicy: {
    policy: "cross-origin" as const,
  },

  crossOriginOpenerPolicy: {
    policy: "same-origin-allow-popups" as const,
  },

  contentSecurityPolicy: {
    directives: {
      // Helmet puede habilitar esta directiva por defecto.
      // En la Raspberry, Station Mode funciona sobre HTTP local.
      "upgrade-insecure-requests": isStationMode
        ? null
        : [],
    },
  },

  ...(isStationMode
    ? {
        // No forzar HTTPS dentro de la red local de la estación.
        strictTransportSecurity: false as const,
      }
    : {}),
};

app.use(
  helmet(helmetOptions)
);

// =========================================================================
// REGISTRO DE PETICIONES
// =========================================================================

if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan(
      process.env.NODE_ENV === "production"
        ? "combined"
        : "dev"
    )
  );
}

// =========================================================================
// CONFIGURACIÓN DE CORS MULTI-ORIGEN
// =========================================================================

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://medic-os-web.vercel.app",

  ...(process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL.trim()]
    : []),
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // -----------------------------------------------------------------------
    // Permitir peticiones sin origen:
    //
    // Postman, scripts locales y health checks internos.
    // -----------------------------------------------------------------------

    if (!origin) {
      return callback(null, true);
    }

    const isExplicitlyAllowed =
      allowedOrigins.includes(origin);

    const isVercelDomain =
      /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(
        origin
      );

    // -----------------------------------------------------------------------
    // MODO ESTACIÓN
    // -----------------------------------------------------------------------
    //
    // Cuando la Raspberry sirve el frontend y la API desde el mismo host,
    // normalmente no existe una petición cross-origin.
    //
    // Aun así, permitimos los orígenes HTTP locales conocidos para facilitar
    // pruebas desde Vite u otros clientes durante el desarrollo.
    // -----------------------------------------------------------------------

    const isLocalNetworkOrigin =
      /^http:\/\/(localhost|127\.0\.0\.1|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/.test(
        origin
      );

    if (
      isExplicitlyAllowed ||
      isVercelDomain ||
      (isStationMode && isLocalNetworkOrigin)
    ) {
      callback(null, true);
    } else {
      console.warn(
        `⚠️ [CORS] Petición bloqueada para el origen no autorizado: ${origin}`
      );

      callback(
        new Error(
          `Bloqueado por CORS: El origen ${origin} no está autorizado.`
        )
      );
    }
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
  ],

  exposedHeaders: [
    "Set-Cookie",
  ],
};

app.use(cors(corsOptions));

// =========================================================================
// PARSERS DE CUERPO Y COOKIES
// =========================================================================
//
// Límite de payload de 10 KB para mitigar saturación de memoria RAM.
// Esto es especialmente importante en Raspberry Pi.
// =========================================================================

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(cookieParser());

// =========================================================================
// CONFIGURACIÓN DE PROTECCIÓN ANTI-DOS / RATE LIMITERS
// =========================================================================

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max:
    process.env.NODE_ENV === "development"
      ? 1000
      : 100,

  message: {
    ok: false,

    message:
      "Demasiadas peticiones desde esta dirección IP. Intenta de nuevo en 15 minutos.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max:
    process.env.NODE_ENV === "development"
      ? 100
      : 15,

  message: {
    ok: false,

    message:
      "Demasiados intentos de autenticación. Por seguridad, inténtalo en 15 minutos.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// =========================================================================
// RUTAS Y CONTROL DE TRÁFICO
// =========================================================================

app.use(
  "/api/auth",
  authLimiter
);

app.use(
  "/auth",
  authLimiter
);

app.use(
  "/api",
  generalLimiter
);

// =========================================================================
// ENDPOINT DE VERIFICACIÓN DE LA API
// =========================================================================
//
// Conservamos la información de la API, pero la exponemos mediante /api
// para que "/" pueda utilizarse como entrada del frontend en Modo Estación.
// =========================================================================

app.get(
  "/api",
  (_req, res) => {
    res.json({
      name: "MedicOS API",
      version: "1.0.0",
      status: "running",
      stationMode: isStationMode,
      timestamp: new Date().toISOString(),
    });
  }
);

// =========================================================================
// ENDPOINT DE PRUEBA DE ERROR OPERACIONAL
// =========================================================================

app.get(
  "/api/test-error",
  (_req, _res, next) => {
    next(
      new AppError(
        "Prueba de error operacional en MedicOS",
        400
      )
    );
  }
);

// =========================================================================
// MONTAJE PRINCIPAL DE RUTAS API
// =========================================================================
//
// Las rutas se mantienen disponibles:
//
//   /api/...
//   /...
//
// El frontend de estación utilizará /api/... mediante apiClient.
// =========================================================================

app.use(
  "/api",
  routes
);

app.use(
  "/",
  routes
);

// =========================================================================
// SERVIDOR WEB LOCAL — MODO ESTACIÓN
// =========================================================================
//
// Cuando:
//
//   STATION_MODE=true
//
// Express también sirve:
//
//   apps/web/dist
//
// Esto permite:
//
//   http://IP-RASPBERRY/
//
// y elimina la necesidad de ejecutar Vite en la demostración.
//
// Flujo:
//
//   Navegador
//       ↓
//   Raspberry
//       ↓
//   Express
//       ├── /api/* → API MedicOS
//       └── /*     → React/PWA
// =========================================================================

if (isStationMode) {
  console.log(
    `📦 [Station] Directorio frontend: ${webDistPath}`
  );

  app.use(
    express.static(webDistPath, {
      index: "index.html",
      maxAge: "1h",
    })
  );

  // -----------------------------------------------------------------------
  // FALLBACK SPA
  // -----------------------------------------------------------------------
  //
  // React Router necesita que rutas como:
  //
  //   /login
  //   /brigadista/dashboard/resumen
  //   /medico/consultas/agenda
  //
  // devuelvan index.html cuando se accede directamente a ellas.
  //
  // Las rutas /api/* ya fueron procesadas anteriormente.
  // -----------------------------------------------------------------------

  app.get(
    "*",
    (req, res, next) => {
      // Nunca devolver index.html para una ruta API inexistente.
      if (
        req.path === "/api" ||
        req.path.startsWith("/api/")
      ) {
        return next(
          new AppError(
            `No se encontró la ruta ${req.originalUrl} en el servidor`,
            404
          )
        );
      }

      res.sendFile(
        path.join(
          webDistPath,
          "index.html"
        ),
        (error) => {
          if (error) {
            next(error);
          }
        }
      );
    }
  );
} else {
  // =========================================================================
  // 404 NORMAL
  // =========================================================================

  app.use(
    "*",
    (req, _res, next) => {
      next(
        new AppError(
          `No se encontró la ruta ${req.originalUrl} en el servidor`,
          404
        )
      );
    }
  );
}

// =========================================================================
// MANEJADOR GLOBAL DE ERRORES
// =========================================================================

app.use(errorHandler);

// =========================================================================
// EXPORTACIÓN
// =========================================================================

export default app;
