import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';

export class UsersService extends BaseService {
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateUserRole(id: string, role: any) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }
}

export const usersService = new UsersService();