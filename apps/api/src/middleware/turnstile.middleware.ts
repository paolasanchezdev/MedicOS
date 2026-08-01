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

    // Si no viene el token, se bloquea la petición al instante
    if (!turnstileToken) {
      return res.status(400).json({
        ok: false,
        message: "Error de seguridad: Falta la verificación Anti-Bot (Turnstile).",
      });
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    // 2. Enviamos el token a Cloudflare para verificar su validez
    const formData = new URLSearchParams();
    if (secretKey) {
      formData.append("secret", secretKey);
    }
    formData.append("response", turnstileToken);
    formData.append("remoteip", req.ip || "");

    const cloudflareUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    
    const result = await fetch(cloudflareUrl, {
      body: formData,
      method: "POST",
    });

    const outcome = (await result.json()) as { success: boolean; "error-codes"?: string[] };

    // 3. Si Cloudflare dice que es un bot o token inválido, rechazamos
    if (!outcome.success) {
      return res.status(403).json({
        ok: false,
        message: "Verificación de seguridad fallida. Acción bloqueada por sospecha de bot.",
        errors: outcome["error-codes"],
      });
    }

    // ¡Si es un humano real, pasa limpiamente al controlador!
    next();
  } catch (error) {
    next(error);
  }
};