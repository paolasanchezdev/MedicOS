//apps/api/src/modules/users/users.service.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import { AppError } from '../../middleware/error.middleware.js';
import { Role, UserStatus } from '@prisma/client';

export class UsersService extends BaseService {
  async getAllUsers() {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    role: Role;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('El correo electrónico ya se encuentra registrado.', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        role: data.role,
        status: UserStatus.ACTIVE,
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
  }

  async updateUserRole(id: string, role: Role) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true, status: true },
    });
  }

  async updateUserCredentials(id: string, password: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true, email: true, updatedAt: true },
    });
  }

  async updateUserStatus(id: string, status: UserStatus) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    return prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, email: true, status: true },
    });
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: UserStatus.INACTIVE,
      },
      select: { id: true, email: true },
    });
  }
}

export const usersService = new UsersService();