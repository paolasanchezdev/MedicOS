// =========================================================================
// ARCHIVO: apps/api/src/middleware/turnstile.middleware.ts
// DESCRIPCIÓN: Middleware de validación Anti-Bot con Cloudflare Turnstile.
// =========================================================================

import { Request, Response, NextFunction } from "express";

export const validateTurnstile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Bypass en entornos locales o de testing
    if (process.env.NODE_ENV !== "production") {
      return next();
    }

    // 2. Extraer el token admitiendo variantes estándar de payloads
    const token =
      req.body?.turnstileToken ||
      req.body?.["cf-turnstile-response"] ||
      req.body?.turnstile_token;

    if (!token) {
      return res.status(400).json({
        ok: false,
        message: "Error de seguridad: Falta la verificación Anti-Bot (Turnstile).",
      });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.warn("⚠️ TURNSTILE_SECRET_KEY no está configurada en variables de entorno.");
      return next();
    }

    // 3. Preparar la petición hacia la API oficial de Cloudflare
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const cloudflareUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    // Timeout de 5 segundos para evitar peticiones colgadas
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const result = await fetch(cloudflareUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const outcome = (await result.json()) as {
        success: boolean;
        "error-codes"?: string[];
        messages?: string[];
      };

      // 4. Validación fallida
      if (!outcome.success) {
        console.error("❌ [Turnstile] Desafío rechazado por Cloudflare:", outcome["error-codes"]);
        return res.status(403).json({
          ok: false,
          message: "Verificación de seguridad fallida. Acción bloqueada por sospecha de bot.",
          errors: outcome["error-codes"],
        });
      }

      // Verificación exitosa
      return next();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("⚠️ Fallo de conexión con Cloudflare Turnstile:", fetchError);

      return res.status(503).json({
        ok: false,
        message: "El servicio de verificación Anti-Bot no está disponible temporalmente. Inténtalo de nuevo.",
      });
    }
  } catch (error) {
    next(error);
  }
};