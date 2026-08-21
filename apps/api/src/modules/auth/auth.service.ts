// =========================================================================
// ARCHIVO: apps/api/src/modules/auth/auth.service.ts
// =========================================================================

import { BaseService } from "../../services/base.service.js";
import { AppError } from "../../middleware/error.middleware.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService extends BaseService {
  async registrarUsuario(datosUsuario: any) {
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

    const finalFirstName = primerNombre
      ? `${primerNombre} ${segundoNombre || ""}`.trim()
      : firstName;

    const finalLastName = primerApellido
      ? `${primerApellido} ${segundoApellido || ""}`.trim()
      : lastName;

    const finalPhone = telefono || phone || null;

    if (!email || !password || !finalFirstName || !finalLastName) {
      throw new AppError(
        "El correo, contraseña, nombre y apellido son obligatorios.",
        400
      );
    }

    const usuarioExistente = await this.db.user.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      throw new AppError("Este correo electrónico ya está registrado.", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashContrasena = await bcrypt.hash(password, salt);

    const nuevoUsuario = await this.db.user.create({
      data: {
        email,
        passwordHash: hashContrasena,
        firstName: finalFirstName,
        lastName: finalLastName,
        phone: finalPhone,
        role: role || "PATIENT", 
        status: "ACTIVE",
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

    return nuevoUsuario;
  }

  async iniciarSesion(credenciales: any) {
    if (!credenciales) {
      throw new AppError("El correo y la contraseña son obligatorios.", 400);
    }

    const { email, password } = credenciales;

    if (!email || !password) {
      throw new AppError("El correo y la contraseña son obligatorios.", 400);
    }

    const usuario = await this.db.user.findUnique({
      where: { email },
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
      secret as string,
      { expiresIn: "8h" }
    );

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        role: usuario.role,
      },
      token,
    };
  }
}