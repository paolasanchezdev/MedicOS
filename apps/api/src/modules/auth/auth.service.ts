// =========================================================================
// ARCHIVO: apps/api/src/modules/auth/auth.service.ts
// DESCRIPCIÓN: Servicio de lógica de negocio para autenticación, hashing
//              seguro de contraseñas y emisión de tokens JWT en MedicOS.
// =========================================================================

import { BaseService } from "../../services/base.service.js";
import { AppError } from "../../middleware/error.middleware.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface RegisterDTO {
  email: string;
  password: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  telefono?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  status?: string;
  createdAt?: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export class AuthService extends BaseService {
  async registrarUsuario(datosUsuario: RegisterDTO): Promise<AuthResponse> {
    if (!datosUsuario) {
      throw new AppError("Los datos de registro son obligatorios.", 400);
    }

    const {
      email,
      password,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      telefono,
      firstName,
      lastName,
      phone,
      role,
    } = datosUsuario;

    const normalizedEmail = email?.trim().toLowerCase();

    const finalFirstName = primerNombre
      ? `${primerNombre.trim()} ${segundoNombre ? segundoNombre.trim() : ""}`.trim()
      : firstName?.trim();

    const finalLastName = primerApellido
      ? `${primerApellido.trim()} ${segundoApellido ? segundoApellido.trim() : ""}`.trim()
      : lastName?.trim();

    const finalPhone = (telefono || phone)?.trim() || null;

    if (!normalizedEmail || !password || !finalFirstName || !finalLastName) {
      throw new AppError(
        "El correo, contraseña, nombre y apellido son obligatorios.",
        400
      );
    }

    const usuarioExistente = await this.db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (usuarioExistente) {
      throw new AppError("Este correo electrónico ya está registrado.", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashContrasena = await bcrypt.hash(password, salt);

    const nuevoUsuario = await this.db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: hashContrasena,
        firstName: finalFirstName,
        lastName: finalLastName,
        phone: finalPhone,
        role: (role ? role.toUpperCase() : "PATIENT") as any, 
        status: "ACTIVE" as any,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("Error interno del servidor: Llave secreta no configurada.", 500);
    }

    const token = jwt.sign(
      {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role,
      },
      secret,
      { expiresIn: "8h" }
    );

    return {
      user: nuevoUsuario,
      token,
    };
  }

  async iniciarSesion(credenciales: LoginDTO): Promise<AuthResponse> {
    if (!credenciales) {
      throw new AppError("El correo y la contraseña son obligatorios.", 400);
    }

    const { email, password } = credenciales;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new AppError("El correo y la contraseña son obligatorios.", 400);
    }

    const usuario = await this.db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!usuario) {
      throw new AppError("Credenciales incorrectas.", 401);
    }

    if (usuario.status !== "ACTIVE") {
      throw new AppError("Este usuario no está autorizado o se encuentra suspendido.", 403);
    }

    const contrasenaValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!contrasenaValida) {
      throw new AppError("Credenciales incorrectas.", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("Error interno del servidor: Llave secreta no configurada.", 500);
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        role: usuario.role 
      },
      secret,
      { expiresIn: "8h" }
    );

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        phone: usuario.phone,
        role: usuario.role,
        status: usuario.status,
      },
      token,
    };
  }
}