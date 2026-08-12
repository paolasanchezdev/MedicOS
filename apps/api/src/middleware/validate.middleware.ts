// =========================================================================
// ARCHIVO: apps/api/src/middleware/validate.middleware.ts
// DESCRIPCIÓN: Middleware universal de validación con Zod para MedicOS.
// =========================================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodObject } from 'zod';
import { AppError } from './error.middleware.js';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      let parsed: any;

      // Verificamos si el esquema utiliza el formato envuelto ({ body, query, params })
      const isWrappedSchema = 
        schema instanceof ZodObject && 
        ('body' in schema.shape || 'query' in schema.shape || 'params' in schema.shape);

      if (isWrappedSchema) {
        parsed = await (schema as ZodObject<any>).parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        if (parsed.body !== undefined) {
          req.body = parsed.body;
        }
        if (parsed.query !== undefined) {
          req.query = parsed.query as Record<string, string>;
        }
        if (parsed.params !== undefined) {
          req.params = parsed.params as Record<string, string>;
        }
      } else {
        // Esquema plano (ej. validación directa de req.body)
        parsed = await schema.parseAsync(req.body);
        req.body = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstErrorMessage = error.issues[0]?.message || 'Datos de entrada inválidos.';
        return next(new AppError(firstErrorMessage, 400));
      }
      next(error);
    }
  };
};