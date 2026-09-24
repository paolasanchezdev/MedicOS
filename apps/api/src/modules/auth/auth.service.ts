// =========================================================================
// ARCHIVO: apps/api/src/modules/auth/auth.service.ts
// DESCRIPCIÓN: Servicio de autenticación con cambio seguro de contraseña,
//              registro de eventos en AuditLog y consulta de seguridad real.
// =========================================================================

import { BaseService } from "../../services/base.service.js";
import { AppError } from "../../middleware/error.middleware.js";
import { PrismaClient, Prisma } from "@prisma/client";
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
  dui?: string;
  address?: string;
  direccion?: string;
  dateOfBirth?: string | Date;
  fechaNacimiento?: string | Date;
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
  updatedAt?: Date;
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
      dui,
      address,
      direccion,
      dateOfBirth,
      fechaNacimiento,
    } = datosUsuario;

    const normalizedEmail = email?.trim().toLowerCase();

    const finalFirstName = primerNombre
      ? `${primerNombre.trim()} ${segundoNombre ? segundoNombre.trim() : ""}`.trim()
      : firstName?.trim();

    const finalLastName = primerApellido
      ? `${primerApellido.trim()} ${segundoApellido ? segundoApellido.trim() : ""}`.trim()
      : lastName?.trim();

    const finalPhone = (telefono || phone)?.trim() || null;
    const finalDui = dui?.trim() ? dui.trim() : null;
    const finalAddress = (address || direccion)?.trim() || "Dirección pendiente de registrar";

    let finalDateOfBirth = new Date("2000-01-01T00:00:00.000Z");
    const rawDob = dateOfBirth || fechaNacimiento;
    if (rawDob) {
      const parsedDate = new Date(rawDob);
      if (!isNaN(parsedDate.getTime())) {
        finalDateOfBirth = parsedDate;
      }
    }

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

    if (finalDui) {
      const pacienteDuiExistente = await this.db.patient.findUnique({
        where: { dui: finalDui },
      });

      if (pacienteDuiExistente) {
        throw new AppError("El DUI ingresado ya está asociado a otro expediente clínico.", 409);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashContrasena = await bcrypt.hash(password, salt);
    const assignedRole = (role ? role.toUpperCase() : "PATIENT");

    const runCreation = async (tx: Prisma.TransactionClient): Promise<UserResponse> => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: hashContrasena,
          firstName: finalFirstName,
          lastName: finalLastName,
          phone: finalPhone,
          role: assignedRole as any,
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
          updatedAt: true,
        },
      });

      if (assignedRole === "PATIENT") {
        await tx.patient.create({
          data: {
            userId: user.id,
            firstName: finalFirstName,
            lastName: finalLastName,
            dateOfBirth: finalDateOfBirth,
            address: finalAddress,
            phone: finalPhone,
            dui: finalDui,
            sex: "OTHER" as any,
            syncStatus: "SYNCED" as any,
            version: 1,
            originDeviceId: "WEB_PORTAL",
            lastModifiedByDeviceId: "WEB_PORTAL",
          },
        });
      }

      return user;
    };

    const nuevoUsuario = "$transaction" in this.db
      ? await (this.db as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => runCreation(tx))
      : await runCreation(this.db as Prisma.TransactionClient);

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

  async iniciarSesion(credenciales: LoginDTO, clientIp?: string): Promise<AuthResponse> {
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

    // Registro real de inicio de sesión en AuditLog
    try {
      await this.db.auditLog.create({
        data: {
          userId: usuario.id,
          action: "LOGIN",
          entity: "User",
          entityId: usuario.id,
          ipAddress: clientIp || null,
        },
      });
    } catch {
      // No bloquea el inicio de sesión si la auditoría falla
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

  /**
   * Cambia la contraseña en PostgreSQL validando la actual y registrando la auditoría.
   */
  async cambiarContrasena(
    userId: string,
    currentPassword: string,
    newPassword: string,
    ipAddress?: string
  ): Promise<{ ok: boolean; message: string }> {
    if (!currentPassword || !newPassword) {
      throw new AppError("Debes ingresar la contraseña actual y la nueva.", 400);
    }

    if (newPassword.length < 8) {
      throw new AppError("La nueva contraseña debe tener al menos 8 caracteres.", 400);
    }

    const usuario = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new AppError("Usuario no encontrado.", 404);
    }

    const esValida = await bcrypt.compare(currentPassword, usuario.passwordHash);
    if (!esValida) {
      throw new AppError("La contraseña actual es incorrecta.", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const nuevoHash = await bcrypt.hash(newPassword, salt);

    // Actualiza la contraseña y el campo updatedAt en la base de datos
    await this.db.user.update({
      where: { id: userId },
      data: {
        passwordHash: nuevoHash,
      },
    });

    // Registrar evento de seguridad en la tabla AuditLog
    try {
      await this.db.auditLog.create({
        data: {
          userId,
          action: "PASSWORD_CHANGED",
          entity: "User",
          entityId: userId,
          ipAddress: ipAddress || null,
        },
      });
    } catch {
      // Ignorar fallo de inserción de auditoría
    }

    return {
      ok: true,
      message: "Contraseña actualizada exitosamente en MedicOS.",
    };
  }

  /**
   * Obtiene el estado real de seguridad y los registros de auditoría de PostgreSQL.
   */
  async obtenerResumenSeguridad(userId: string) {
    const usuario = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      throw new AppError("Usuario no encontrado.", 404);
    }

    const logs = await this.db.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return {
      passwordLastChanged: usuario.updatedAt,
      accountCreatedAt: usuario.createdAt,
      twoFactorEnabled: false,
      auditLogs: logs.map((log: any) => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt,
      })),
    };
  }
}