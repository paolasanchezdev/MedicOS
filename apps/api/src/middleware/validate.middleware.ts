// =========================================================================
// ARCHIVO: apps/api/src/middleware/validate.middleware.ts
// DESCRIPCIÓN: Middleware universal de validación de esquemas Zod con soporte
//              para esquemas planos, envueltos y con refinamiento (.refine).
// =========================================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodObject, ZodEffects, ZodTypeAny } from 'zod';
import { AppError } from './error.middleware.js';

export const validate = (schema: ZodSchema<unknown>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Desenvolver el esquema subyacente si contiene ZodEffects (.refine / .transform)
      let targetSchema: ZodTypeAny = schema;
      while (targetSchema instanceof ZodEffects) {
        targetSchema = targetSchema.innerType();
      }

      // Verificar si el esquema valida estructura compuesta ({ body, query, params })
      const isWrappedSchema =
        targetSchema instanceof ZodObject &&
        ('body' in targetSchema.shape || 'query' in targetSchema.shape || 'params' in targetSchema.shape);

      if (isWrappedSchema) {
        const parsed = (await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        })) as { body?: unknown; query?: Record<string, unknown>; params?: Record<string, unknown> };

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
        // Validación de esquema plano directamente sobre el cuerpo de la petición (req.body)
        const parsed = await schema.parseAsync(req.body);
        req.body = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstErrorMessage = error.issues[0]?.message || 'Datos de entrada inválidos.';
        const validationDetails = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return next(new AppError(firstErrorMessage, 400, true, validationDetails));
      }
      next(error);
    }
  };
};