// apps/api/src/routes/health.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import { BaseService } from "../services/base.service.js"; // Clave: usar .js
import { checkAuth } from "../middleware/auth.middleware.js"; // <-- Importamos tu nuevo middleware

const router = Router();
const baseService = new BaseService();

// Protegemos esta ruta pasándole checkAuth antes del controlador principal
router.get("/health", checkAuth, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const dbCheck = await baseService.verificarConexionDB();
    
    res.json({
      service: "MedicOS API",
      status: "healthy",
      database: "Conexión local exitosa con PostgreSQL (Prisma v7)",
      // Podemos ver quién está haciendo la consulta gracias al middleware
      consultadoPor: _req.user,
      dataPreview: dbCheck
    });
  } catch (error) {
    next(error);
  }
});

export default router;