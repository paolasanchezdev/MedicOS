export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Error interno del servidor';

  // En desarrollo queremos ver el stack trace completo, en producción no.
  const response = {
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (!(err instanceof AppError)) {
    // Si es un error no controlado (ej. fallo de sintaxis), lo logueamos internamente
    console.error('💥 ERROR NO CONTROLADO:', err);
  }

  res.status(statusCode).json(response);
};
