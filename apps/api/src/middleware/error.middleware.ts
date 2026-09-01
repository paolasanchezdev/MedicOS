// =========================================================================
// ARCHIVO: apps/api/src/middleware/error.middleware.ts
// DESCRIPCIÓN: Manejador centralizado de excepciones y mapeo de errores
//              (AppError, Prisma, Zod, JWT) para MedicOS.
// =========================================================================

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

const { JsonWebTokenError, TokenExpiredError } = jwt;

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, isOperational = true, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Error interno del servidor';
  let details: unknown = undefined;

  // 1. Error operacional personalizado
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }
  // 2. Errores de validación de Zod
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Error de validación en los datos enviados';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }
  // 3. Errores conocidos de Prisma ORM
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        statusCode = 409;
        const target = (err.meta?.target as string[]) || [];
        message = `Ya existe un registro con el valor especificado para: ${
          Array.isArray(target) ? target.join(', ') : 'campo único'
        }`;
        break;
      }
      case 'P2025':
        statusCode = 404;
        message = 'El registro solicitado no fue encontrado';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Violación de clave foránea: el registro asociado no existe';
        break;
      case 'P2021':
        statusCode = 500;
        message = 'La tabla solicitada no existe en la base de datos. Requiere sincronización de esquema (db:push).';
        break;
      default:
        statusCode = 400;
        message = `Error de base de datos (${err.code})`;
        break;
    }
  }
  // 4. Errores de validación de esquema en Prisma
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Datos incompatibles con el esquema de la base de datos';
  }
  // 5. Errores de autenticación JWT
  else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'La sesión ha expirado. Por favor, inicia sesión nuevamente.';
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Token de autenticación inválido o alterado.';
  }
  // 6. Errores estándar de JavaScript
  else if (err instanceof Error) {
    message = err.message || message;
  }

  // Registro en consola únicamente para fallos internos 500 no controlados
  if (statusCode === 500) {
    console.error('💥 [ERROR NO CONTROLADO]:', err);
  }

  res.status(statusCode).json({
    ok: false,
    statusCode,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV === 'development' && err instanceof Error
      ? { stack: err.stack }
      : {}),
  });
};