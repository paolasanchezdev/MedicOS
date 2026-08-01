// apps/api/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware.js"; // Clave: usar .js
import jwt from "jsonwebtoken";

// Extendemos la interfaz global de Request de Express
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

// 1. VERIFICACIÓN DE AUTENTICACIÓN (Soporte Dual: Cookie + Header)
export const checkAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // A. Buscar en Cookie HttpOnly (Método principal)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // B. Buscar en Header Authorization (Respaldo)
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Si no se encontró el token en ninguno de los dos
    if (!token) {
      throw new AppError("No autorizado. Token de autenticación faltante.", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("Error interno: Llave secreta no configurada.", 500);
    }

    // Verificar firma del token
    const decoded = jwt.verify(token, secret) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.", 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Token de seguridad inválido.", 401));
    } else {
      next(error);
    }
  }
};

// 2. VERIFICACIÓN DE ROLES
export const checkRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("No autorizado. Usuario no autenticado.", 401));
    }

    const userRole = req.user.role.toUpperCase();
    const formattedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

    if (!formattedAllowedRoles.includes(userRole)) {
      return next(
        new AppError(
          `Acceso denegado. El rol '${userRole}' no tiene permisos para esta acción.`,
          403
        )
      );
    }

    next();
  };
};