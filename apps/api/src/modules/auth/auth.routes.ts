// =========================================================================
// ARCHIVO: apps/api/src/modules/auth/auth.routes.ts
// DESCRIPCIÓN: Definición de rutas del módulo de autenticación con protección
//              Turnstile, validación de esquemas Zod y verificación de sesión.
// =========================================================================

import { Router } from "express";
import { register, login, logout, getMe } from "./auth.controller.js";
import { checkAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { validateTurnstile } from "../../middleware/turnstile.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = Router();

// 🛡️ Endpoints públicos protegidos con Cloudflare Turnstile y validación de esquema
router.post("/register", validateTurnstile, validate(registerSchema), register);
router.post("/register-patient", validateTurnstile, validate(registerSchema), register);
router.post("/login", validateTurnstile, validate(loginSchema), login);

// 🔒 Endpoint de verificación de sesión activa (utilizado por el frontend al recargar)
router.get("/me", checkAuth, getMe);

// 🚪 Cierre de sesión
router.post("/logout", logout);

export default router;