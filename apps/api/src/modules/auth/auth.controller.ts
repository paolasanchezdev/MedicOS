// =========================================================================
// ARCHIVO: apps/api/src/modules/auth/auth.controller.ts
// DESCRIPCIÓN: Controlador de autenticación con soporte para cambio de contraseña,
//              consulta de seguridad y eventos de auditoría reales.
// =========================================================================

import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

const isProduction = process.env.NODE_ENV === "production";

// Configuración de cookie HttpOnly compatible con Vercel (Cross-Origin) y Localhost
export const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
  path: "/",
});

// Helper seguro para extraer la IP real del cliente evitando accesos undefined
const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    const parts = forwarded.split(",");
    const firstIp = parts[0];
    if (firstIp) {
      return firstIp.trim();
    }
  }
  return req.socket.remoteAddress || req.ip || "127.0.0.1";
};

// ==========================================
// CONTROLADOR: Registro
// ==========================================
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resultado = await authService.registrarUsuario(req.body);
    
    if (resultado?.token) {
      res.cookie("token", resultado.token, getCookieOptions());
    }

    res.status(201).json({
      ok: true,
      message: "Usuario registrado con éxito en MedicOS",
      user: resultado.user,
      token: resultado.token,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CONTROLADOR: Login
// ==========================================
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clientIp = getClientIp(req);
    const resultado = await authService.iniciarSesion(req.body, clientIp);
    
    if (resultado?.token) {
      res.cookie("token", resultado.token, getCookieOptions());
    }
    
    res.status(200).json({
      ok: true,
      message: "Inicio de sesión exitoso",
      ...resultado,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CONTROLADOR: Logout
// ==========================================
export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
      path: "/",
    });

    res.status(200).json({
      ok: true,
      message: "Sesión cerrada correctamente.",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CONTROLADOR: Verificar Sesión Actual (Me)
// ==========================================
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        ok: false,
        message: "No autenticado.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CONTROLADOR: Obtener Estado Real de Seguridad
// ==========================================
export const getSecurityStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ ok: false, message: "No autenticado." });
      return;
    }

    const data = await authService.obtenerResumenSeguridad(req.user.id);
    res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CONTROLADOR: Cambiar Contraseña en PostgreSQL
// ==========================================
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ ok: false, message: "No autenticado." });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const clientIp = getClientIp(req);

    const resultado = await authService.cambiarContrasena(
      req.user.id,
      currentPassword,
      newPassword,
      clientIp
    );

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};