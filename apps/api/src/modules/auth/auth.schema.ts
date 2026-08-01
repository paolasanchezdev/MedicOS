// =========================================================================
// ARCHIVO: apps/api/src/schemas/auth.schema.ts
// =========================================================================

import { z } from "zod";

// 1. Esquema para el Login
export const loginSchema = z.object({
  email: z
    .string({ message: "El correo electrónico es obligatorio." })
    .email("El formato del correo electrónico no es válido."),
  password: z
    .string({ message: "La contraseña es obligatoria." })
    .min(1, "La contraseña no puede estar vacía."),
}).passthrough();

// 2. Esquema para el Registro
export const registerSchema = z.object({
  email: z
    .string({ message: "El correo electrónico es obligatorio." })
    .email("Ingrese un correo electrónico válido."),
  password: z
    .string({ message: "La contraseña es obligatoria." })
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
  
  // Nombres y Apellidos (Soporte completo para campos individuales y combinados)
  primerNombre: z.string().optional(),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().optional(),
  segundoApellido: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  nombre: z.string().optional(),
  apellido: z.string().optional(),

  // Datos de contacto e identificación
  telefono: z.string().optional(),
  phone: z.string().optional(),
  dui: z.string().optional(),
  role: z.string().optional(),

  // Tokens anti-bot de Cloudflare Turnstile
  turnstileToken: z.string().optional(),
  turnstile_token: z.string().optional(),
  "cf-turnstile-response": z.string().optional(),
}).passthrough(); // 👈 .passthrough() permite que ningún campo del payload sea filtrado