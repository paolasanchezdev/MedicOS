import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';

export interface CreateBrigadeDTO {
  name: string;
  department: string;
  municipality: string;
  startDate: string;
  endDate?: string;
  leaderId?: string;
  originDeviceId?: string;
}

export class BrigadesService extends BaseService {
  async getAllBrigades() {
    return prisma.brigade.findMany({
      where: { deletedAt: null },
      include: {
        leader: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBrigadeById(id: string) {
    return prisma.brigade.findFirst({
      where: { id, deletedAt: null },
      include: {
        leader: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
        },
      },
    });
  }

  async createBrigade(data: CreateBrigadeDTO) {
    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';
    return prisma.brigade.create({
      data: {
        name: data.name,
        department: data.department,
        municipality: data.municipality,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        leaderId: data.leaderId || null,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
    });
  }
}

export const brigadesService = new BrigadesService();