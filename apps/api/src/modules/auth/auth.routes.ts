// =========================================================================
// ARCHIVO: apps/api/src/modules/auth/auth.routes.ts
// DESCRIPCIÓN: Definición de rutas del módulo de autenticación y seguridad.
// =========================================================================

import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  getSecurityStatus,
  changePassword,
} from "./auth.controller.js";
import { checkAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { validateTurnstile } from "../../middleware/turnstile.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = Router();

// 🛡️ Endpoints públicos
router.post("/register", validateTurnstile, validate(registerSchema), register);
router.post("/register-patient", validateTurnstile, validate(registerSchema), register);
router.post("/login", validateTurnstile, validate(loginSchema), login);

// 🔒 Sesión del usuario actual
router.get("/me", checkAuth, getMe);

// 🔒 Endpoints de seguridad reales (PostgreSQL)
router.get("/security/status", checkAuth, getSecurityStatus);
router.post("/security/change-password", checkAuth, changePassword);

// 🚪 Cierre de sesión
router.post("/logout", logout);

export default router;