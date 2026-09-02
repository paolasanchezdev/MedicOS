// =========================================================================
// ARCHIVO: apps/api/src/routes/health.routes.ts
// DESCRIPCIÓN: Endpoint de diagnóstico y salud del sistema MedicOS.
// =========================================================================

import { Router, Request, Response, NextFunction } from "express";
import { BaseService } from "../services/base.service.js";
import { checkAuth } from "../middleware/auth.middleware.js";

class HealthService extends BaseService {}

const router = Router();
const healthService = new HealthService();

const handleHealthCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isDbConnected = await healthService.verificarConexionDB();

    const statusCode = isDbConnected ? 200 : 503;

    res.status(statusCode).json({
      service: "MedicOS API",
      status: isDbConnected ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      database: isDbConnected
        ? "Conexión activa con PostgreSQL (Driver-Pg / Prisma)"
        : "Sin conexión con el motor de base de datos",
      consultadoPor: req.user || "Público / Monitor de Infraestructura",
    });
  } catch (error) {
    next(error);
  }
};

// Rutas de diagnóstico (soporta acceso raíz del módulo y subruta /health)
router.get("/", checkAuth, handleHealthCheck);
router.get("/health", checkAuth, handleHealthCheck);

export default router;