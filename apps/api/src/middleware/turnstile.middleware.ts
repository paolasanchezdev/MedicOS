// apps/api/src/middleware/turnstile.middleware.ts
import { Request, Response, NextFunction } from "express";

export const validateTurnstile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Extraemos el token que enviará el frontend en el body
    const { turnstileToken } = req.body;

    // Si no viene el token en producción, se bloquea la petición
    if (!turnstileToken) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("⚠️ [DEV] Token de Turnstile ausente. Omitiendo validación en entorno local.");
        return next();
      }

      return res.status(400).json({
        ok: false,
        message: "Error de seguridad: Falta la verificación Anti-Bot (Turnstile).",
      });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    // 2. Preparamos la petición a Cloudflare
    const formData = new URLSearchParams();
    if (secretKey) {
      formData.append("secret", secretKey);
    }
    formData.append("response", turnstileToken);
    formData.append("remoteip", req.ip || "");

    const cloudflareUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    // Timeout de 5 segundos para prevenir peticiones colgadas (ETIMEDOUT)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const result = await fetch(cloudflareUrl, {
        body: formData,
        method: "POST",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const outcome = (await result.json()) as {
        success: boolean;
        "error-codes"?: string[];
      };

      // 3. Si Cloudflare indica token inválido o sospecha de bot
      if (!outcome.success) {
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
      console.error("⚠️ Fallo de conexión o tiempo agotado (ETIMEDOUT) con Cloudflare Turnstile:", fetchError);

      // En entorno de desarrollo permite el paso si falla la red externa
      if (process.env.NODE_ENV !== "production") {
        console.warn("🛠️ [DEV] Conexión a Cloudflare no disponible. Permitiendo acceso local.");
        return next();
      }

      return res.status(503).json({
        ok: false,
        message: "El servicio de verificación Anti-Bot no está disponible temporalmente. Inténtalo de nuevo.",
      });
    }

  } catch (error) {
    next(error);
  }
};