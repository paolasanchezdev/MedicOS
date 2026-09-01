// =========================================================================
// ARCHIVO: apps/api/src/middleware/turnstile.middleware.ts
// DESCRIPCIÓN: Middleware de validación Anti-Bot con Cloudflare Turnstile
//              con soporte para validación por IP y control de timeouts.
// =========================================================================

import { Request, Response, NextFunction } from "express";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  messages?: string[];
}

export const validateTurnstile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Bypass seguro en entornos de desarrollo y testing local
    if (process.env.NODE_ENV !== "production") {
      return next();
    }

    // 2. Extraer el token admitiendo variantes estándar de payloads
    const token =
      req.body?.turnstileToken ||
      req.body?.["cf-turnstile-response"] ||
      req.body?.turnstile_token;

    if (!token) {
      res.status(400).json({
        ok: false,
        message: "Error de seguridad: Falta el token de verificación Anti-Bot (Turnstile).",
      });
      return;
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.error("❌ [Turnstile] TURNSTILE_SECRET_KEY no está configurada en producción.");
      res.status(500).json({
        ok: false,
        message: "Error de configuración interna del servicio de seguridad.",
      });
      return;
    }

    // 3. Preparar parámetros de validación para Cloudflare
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    // Obtener la IP real del cliente si está detrás de proxy
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip;
    if (clientIp) {
      formData.append("remoteip", clientIp);
    }

    const cloudflareUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    // Timeout de 5 segundos para evitar peticiones colgadas
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(cloudflareUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const outcome = (await response.json()) as TurnstileVerifyResponse;

      // 4. Verificación rechazada por Cloudflare
      if (!outcome.success) {
        console.warn("⚠️ [Turnstile] Desafío rechazado por Cloudflare:", outcome["error-codes"]);
        res.status(403).json({
          ok: false,
          message: "Verificación de seguridad no superada. Acción bloqueada por sospecha de bot.",
          errors: outcome["error-codes"],
        });
        return;
      }

      // 5. Verificación exitosa
      return next();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("⚠️ [Turnstile] Fallo de conexión o timeout con Cloudflare:", fetchError);

      res.status(503).json({
        ok: false,
        message: "El servicio de verificación Anti-Bot no respondió a tiempo. Inténtalo de nuevo.",
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};