// apps/api/src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "./error.middleware.js";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Valida req.body con las reglas del esquema Zod
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // En Zod v4 se lee 'issues' para obtener el primer mensaje de error
        const firstErrorMessage = error.issues[0]?.message || "Datos de entrada inválidos.";
        return next(new AppError(firstErrorMessage, 400));
      }
      next(error);
    }
  };
};

