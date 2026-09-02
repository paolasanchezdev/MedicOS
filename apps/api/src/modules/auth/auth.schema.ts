// =========================================================================
// ARCHIVO: apps/api/src/modules/auth/auth.schema.ts
// DESCRIPCIÓN: Esquemas de validación Zod con inferencia de tipos y
//              soporte multi-formato para autenticación en MedicOS.
// =========================================================================

import { z } from "zod";

// =========================================================================
// 1. ESQUEMA DE LOGIN
// =========================================================================
export const loginSchema = z
  .object({
    email: z
      .string({ required_error: "El correo electrónico es obligatorio." })
      .trim()
      .toLowerCase()
      .email("El formato del correo electrónico no es válido."),
    password: z
      .string({ required_error: "La contraseña es obligatoria." })
      .min(1, "La contraseña no puede estar vacía."),
    turnstileToken: z.string().optional(),
    turnstile_token: z.string().optional(),
    "cf-turnstile-response": z.string().optional(),
  })
  .passthrough();

export type LoginInput = z.infer<typeof loginSchema>;

// =========================================================================
// 2. ESQUEMA DE REGISTRO
// =========================================================================
export const registerSchema = z
  .object({
    email: z
      .string({ required_error: "El correo electrónico es obligatorio." })
      .trim()
      .toLowerCase()
      .email("Ingrese un correo electrónico válido."),
    password: z
      .string({ required_error: "La contraseña es obligatoria." })
      .min(6, "La contraseña debe tener al menos 6 caracteres."),

    // Campos de nombres (formatos compuestos o directos)
    primerNombre: z.string().trim().optional(),
    segundoNombre: z.string().trim().optional(),
    primerApellido: z.string().trim().optional(),
    segundoApellido: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    nombre: z.string().trim().optional(),
    apellido: z.string().trim().optional(),

    // Contacto e identificación
    telefono: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    dui: z.string().trim().optional(),
    role: z.string().trim().optional(),

    // Datos clínicos iniciales para expediente territorial
    address: z.string().trim().optional(),
    direccion: z.string().trim().optional(),
    dateOfBirth: z.string().trim().optional(),
    fechaNacimiento: z.string().trim().optional(),

    // Tokens anti-bot de Cloudflare Turnstile
    turnstileToken: z.string().optional(),
    turnstile_token: z.string().optional(),
    "cf-turnstile-response": z.string().optional(),
  })
  .passthrough()
  .refine(
    (data) => {
      const hasFirst = Boolean(data.primerNombre || data.firstName || data.nombre);
      const hasLast = Boolean(data.primerApellido || data.lastName || data.apellido);
      return hasFirst && hasLast;
    },
    {
      message: "Debe proporcionar al menos un nombre y un apellido válidos.",
      path: ["firstName"],
    }
  );

export type RegisterInput = z.infer<typeof registerSchema>;