// =========================================================================
// ARCHIVO: apps/api/src/modules/auth/auth.controller.ts
// DESCRIPCIÓN: Controlador de autenticación con soporte para cookies cross-site.
// =========================================================================

import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

const isProduction = process.env.NODE_ENV === "production";

// Configuración de cookie HttpOnly compatible con Vercel (Cross-Origin) y Localhost
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
  path: "/",
});

// ==========================================
// CONTROLADOR: Registro
// ==========================================
export const register = async (req: Request, res: Response, next: NextFunction) => {
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
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resultado = await authService.iniciarSesion(req.body);
    
    // 🔒 Adjuntar la cookie 'token' a la respuesta HTTP
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
export const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Destruimos la cookie 'token' en el navegador con las mismas directivas
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