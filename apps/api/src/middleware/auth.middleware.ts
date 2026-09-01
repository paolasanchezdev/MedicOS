// =========================================================================
// ARCHIVO: apps/api/src/middleware/auth.middleware.ts
// DESCRIPCIÓN: Middlewares de autenticación (JWT Dual: Cookie/Header)
//              y autorización basada en roles (RBAC) para MedicOS.
// =========================================================================

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "./error.middleware.js";

// Interfaz para el payload decodificado del JWT
export interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Extensión de la interfaz global de Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// =========================================================================
// 1. VERIFICACIÓN DE AUTENTICACIÓN (Soporte Dual: Cookie HttpOnly + Bearer)
// =========================================================================
export const checkAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    // A. Buscar en Cookie HttpOnly (Método web principal)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // B. Buscar en Header Authorization (Respaldo API / PWA / Dispositivos)
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]?.trim();
    }

    if (!token) {
      return next(new AppError("No autorizado. Sesión no encontrada o token faltante.", 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new AppError("Error interno del servidor: Llave JWT no configurada.", 500));
    }

    // Verificar firma y expiración del token
    const decoded = jwt.verify(token, secret) as AuthTokenPayload;

    if (!decoded.id || !decoded.role) {
      return next(new AppError("Token de autenticación corrupto o con formato inválido.", 401));
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role.toUpperCase(),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Token de seguridad inválido o manipulado.", 401));
    }
    next(error);
  }
};

// =========================================================================
// 2. CONTROL DE ACCESO BASADO EN ROLES (RBAC)
// =========================================================================
export const checkRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("No autorizado. Usuario no autenticado.", 401));
    }

    const userRole = req.user.role.toUpperCase();
    const formattedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

    if (!formattedAllowedRoles.includes(userRole)) {
      return next(
        new AppError(
          `Acceso denegado. El rol '${userRole}' no cuenta con los permisos necesarios.`,
          403
        )
      );
    }

    next();
  };
};