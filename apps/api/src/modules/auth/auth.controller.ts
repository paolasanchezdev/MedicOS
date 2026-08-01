// apps/api/src/modules/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js"; // Clave: usar .js

const authService = new AuthService();

// Configuración reutilizable para la Cookie HttpOnly
const cookieOptions = {
  httpOnly: true, // 🔒 Impide que JavaScript (XSS) pueda acceder al token
  secure: process.env.NODE_ENV === "production", // true si estamos en HTTPS (Producción)
  sameSite: "lax" as const, // Protege contra ataques CSRF
  maxAge: 24 * 60 * 60 * 1000, // Expiración: 24 horas (en milisegundos)
};

// ==========================================
// CONTROLADOR: Registro
// ==========================================
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nuevoUsuario = await authService.registrarUsuario(req.body);
    
    // Si registrarUsuario ya devuelve un token de autologin:
    if ((nuevoUsuario as any)?.token) {
      res.cookie("token", (nuevoUsuario as any).token, cookieOptions);
    }

    res.status(201).json({
      ok: true,
      message: "Usuario registrado con éxito en MedicOS",
      user: nuevoUsuario,
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
      res.cookie("token", resultado.token, cookieOptions);
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
// CONTROLADOR: Logout (NUEVO 🆕)
// ==========================================
export const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Destruimos la cookie 'token' en el navegador
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      ok: true,
      message: "Sesión cerrada correctamente.",
    });
  } catch (error) {
    next(error);
  }
};