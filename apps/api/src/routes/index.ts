// apps/api/src/routes/index.ts
import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js"; // <-- Importamos las nuevas rutas

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes); // <-- Montamos las rutas bajo /api/auth

export default router;