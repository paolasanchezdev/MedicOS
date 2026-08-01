// apps/api/src/routes/auth.routes.ts
import { Router } from "express";
import { register, login, logout } from "../auth/auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { validateTurnstile } from "../../middleware/turnstile.middleware.js"; // 👈 Importamos el middleware de Turnstile
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = Router();

// 🛡️ Protegemos los endpoints de autenticación contra Bots y Fuerza Bruta
router.post("/register", validateTurnstile, validate(registerSchema), register);
router.post("/register-patient", validateTurnstile, validate(registerSchema), register);
router.post("/login", validateTurnstile, validate(loginSchema), login);

// Ruta para cerrar sesión (no requiere verificación de Turnstile)
router.post("/logout", logout);

export default router;