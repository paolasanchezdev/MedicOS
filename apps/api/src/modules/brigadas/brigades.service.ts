// apps/api/src/modules/brigadas/brigades.service.ts
import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import { BrigadeStatus, Role, UserStatus, SyncStatus, Prisma } from '@prisma/client';

export interface CreateBrigadeDTO {
  name: string;
  department: string;
  municipality: string;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  startDate: string;
  endDate?: string | null | undefined;
  leaderId?: string | null | undefined;
  originDeviceId?: string | undefined;
  memberIds?: string[] | undefined;
}

export interface UpdateBrigadeDTO {
  name?: string | undefined;
  department?: string | undefined;
  municipality?: string | undefined;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  startDate?: string | undefined;
  endDate?: string | null | undefined;
  leaderId?: string | null | undefined;
  status?: BrigadeStatus | undefined;
  originDeviceId?: string | undefined;
}

export interface BrigadeFilters {
  search?: string | undefined;
  department?: string | undefined;
  status?: BrigadeStatus | 'ALL' | undefined;
}

export class BrigadesService extends BaseService {
  async getAllBrigades(filters?: BrigadeFilters) {
    const where: Prisma.BrigadeWhereInput = {
      deletedAt: null,
    };

    if (filters?.department && filters.department !== 'ALL') {
      where.department = { equals: filters.department, mode: 'insensitive' };
    }

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { department: { contains: q, mode: 'insensitive' } },
        { municipality: { contains: q, mode: 'insensitive' } },
      ];
    }

    const brigades = await prisma.brigade.findMany({
      where,
      include: {
        leader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            consultations: true,
            workSessions: true,
            supplyItems: true,
            equipmentItems: true,
            devices: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return brigades.map((b) => ({
      id: b.id,
      name: b.name,
      department: b.department,
      municipality: b.municipality,
      latitude: b.latitude,
      longitude: b.longitude,
      status: b.status,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate ? b.endDate.toISOString() : null,
      leaderId: b.leaderId,
      leader: b.leader
        ? {
            id: b.leader.id,
            fullName: `${b.leader.firstName} ${b.leader.lastName}`,
            email: b.leader.email,
            phone: b.leader.phone,
            role: b.leader.role,
          }
        : null,
      membersCount: b.members.length,
      members: b.members.map((m) => ({
        id: m.id,
        userId: m.user.id,
        fullName: `${m.user.firstName} ${m.user.lastName}`,
        email: m.user.email,
        phone: m.user.phone,
        role: m.user.role,
        status: m.user.status,
        joinedAt: m.joinedAt.toISOString(),
      })),
      totalConsultations: b._count.consultations,
      totalWorkSessions: b._count.workSessions,
      totalSuppliesAssigned: b._count.supplyItems,
      totalEquipmentAssigned: b._count.equipmentItems,
      totalDevicesAssigned: b._count.devices,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));
  }

  async getBrigadeById(id: string) {
    const b = await prisma.brigade.findFirst({
      where: { id, deletedAt: null },
      include: {
        leader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
              },
            },
          },
        },
        workSessions: {
          where: { status: 'STARTED' },
          include: {
            brigadista: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        _count: {
          select: {
            consultations: true,
            workSessions: true,
            supplyItems: true,
            equipmentItems: true,
            devices: true,
          },
        },
      },
    });

    if (!b) return null;

    return {
      id: b.id,
      name: b.name,
      department: b.department,
      municipality: b.municipality,
      latitude: b.latitude,
      longitude: b.longitude,
      status: b.status,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate ? b.endDate.toISOString() : null,
      leaderId: b.leaderId,
      leader: b.leader
        ? {
            id: b.leader.id,
            fullName: `${b.leader.firstName} ${b.leader.lastName}`,
            email: b.leader.email,
            phone: b.leader.phone,
            role: b.leader.role,
          }
        : null,
      members: b.members.map((m) => ({
        id: m.id,
        userId: m.user.id,
        fullName: `${m.user.firstName} ${m.user.lastName}`,
        email: m.user.email,
        phone: m.user.phone,
        role: m.user.role,
        status: m.user.status,
        joinedAt: m.joinedAt.toISOString(),
      })),
      activeWorkSessions: b.workSessions.map((ws) => ({
        id: ws.id,
        brigadistaId: ws.brigadistaId,
        brigadistaName: `${ws.brigadista.firstName} ${ws.brigadista.lastName}`,
        startedAt: ws.startedAt.toISOString(),
      })),
      totalConsultations: b._count.consultations,
      totalWorkSessions: b._count.workSessions,
      totalSuppliesAssigned: b._count.supplyItems,
      totalEquipmentAssigned: b._count.equipmentItems,
      totalDevicesAssigned: b._count.devices,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    };
  }

  async createBrigade(data: CreateBrigadeDTO) {
    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';

    return prisma.$transaction(async (tx) => {
      if (data.leaderId) {
        const leader = await tx.user.findUnique({ where: { id: data.leaderId } });
        if (!leader || leader.deletedAt || leader.status !== UserStatus.ACTIVE) {
          throw new Error('El responsable seleccionado no es válido o está inactivo.');
        }
      }

      const brigade = await tx.brigade.create({
        data: {
          name: data.name.trim(),
          department: data.department.trim(),
          municipality: data.municipality.trim(),
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          status: BrigadeStatus.PLANNED,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          leaderId: data.leaderId ?? null,
          syncStatus: SyncStatus.SYNCED,
          version: 1,
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

      const membersToInsert = new Set<string>(data.memberIds || []);
      if (data.leaderId) {
        membersToInsert.add(data.leaderId);
      }

      if (membersToInsert.size > 0) {
        await tx.brigadeMember.createMany({
          data: Array.from(membersToInsert).map((userId) => ({
            brigadeId: brigade.id,
            userId,
          })),
          skipDuplicates: true,
        });
      }

      return brigade;
    });
  }

  async updateBrigade(id: string, data: UpdateBrigadeDTO) {
    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';

    return prisma.$transaction(async (tx) => {
      const existing = await tx.brigade.findUnique({ where: { id } });
      if (!existing || existing.deletedAt) {
        throw new Error('La brigada no existe.');
      }

      if (data.leaderId) {
        const leader = await tx.user.findUnique({ where: { id: data.leaderId } });
        if (!leader || leader.deletedAt) {
          throw new Error('El líder especificado no existe.');
        }
      }

      return tx.brigade.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name.trim() }),
          ...(data.department && { department: data.department.trim() }),
          ...(data.municipality && { municipality: data.municipality.trim() }),
          ...(data.latitude !== undefined && { latitude: data.latitude }),
          ...(data.longitude !== undefined && { longitude: data.longitude }),
          ...(data.startDate && { startDate: new Date(data.startDate) }),
          ...(data.endDate !== undefined && {
            endDate: data.endDate ? new Date(data.endDate) : null,
          }),
          ...(data.leaderId !== undefined && { leaderId: data.leaderId }),
          ...(data.status && { status: data.status }),
          version: { increment: 1 },
          lastModifiedByDeviceId: deviceId,
        },
      });
    });
  }

  async updateBrigadeStatus(id: string, status: BrigadeStatus, deviceId: string = 'SERVER_CENTRAL') {
    const brigade = await prisma.brigade.findUnique({ where: { id } });
    if (!brigade || brigade.deletedAt) {
      throw new Error('La brigada no existe.');
    }

    return prisma.brigade.update({
      where: { id },
      data: {
        status,
        ...(status === BrigadeStatus.COMPLETED && !brigade.endDate ? { endDate: new Date() } : {}),
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async assignLeader(brigadeId: string, leaderId: string | null, deviceId: string = 'SERVER_CENTRAL') {
    return prisma.$transaction(async (tx) => {
      const brigade = await tx.brigade.findUnique({ where: { id: brigadeId } });
      if (!brigade || brigade.deletedAt) {
        throw new Error('La brigada no existe.');
      }

      if (leaderId) {
        const user = await tx.user.findUnique({ where: { id: leaderId } });
        if (!user || user.deletedAt || user.status !== UserStatus.ACTIVE) {
          throw new Error('El usuario designado como líder no es válido o está inactivo.');
        }

        await tx.brigadeMember.upsert({
          where: {
            userId_brigadeId: {
              userId: leaderId,
              brigadeId,
            },
          },
          create: { userId: leaderId, brigadeId },
          update: {},
        });
      }

      return tx.brigade.update({
        where: { id: brigadeId },
        data: {
          leaderId,
          version: { increment: 1 },
          lastModifiedByDeviceId: deviceId,
        },
      });
    });
  }

  async addMembers(brigadeId: string, userIds: string[]) {
    return prisma.$transaction(async (tx) => {
      const brigade = await tx.brigade.findUnique({ where: { id: brigadeId } });
      if (!brigade || brigade.deletedAt) {
        throw new Error('La brigada no existe.');
      }

      const validUsers = await tx.user.findMany({
        where: {
          id: { in: userIds },
          deletedAt: null,
          status: UserStatus.ACTIVE,
        },
      });

      if (validUsers.length === 0) {
        throw new Error('No se encontraron usuarios válidos para asignar.');
      }

      await tx.brigadeMember.createMany({
        data: validUsers.map((u) => ({
          brigadeId,
          userId: u.id,
        })),
        skipDuplicates: true,
      });

      return { success: true, count: validUsers.length };
    });
  }

  async removeMember(brigadeId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const brigade = await tx.brigade.findUnique({ where: { id: brigadeId } });
      if (brigade?.leaderId === userId) {
        await tx.brigade.update({
          where: { id: brigadeId },
          data: { leaderId: null },
        });
      }

      await tx.brigadeMember.deleteMany({
        where: { brigadeId, userId },
      });

      return { success: true };
    });
  }

  async deleteBrigade(id: string, deviceId: string = 'SERVER_CENTRAL') {
    return prisma.brigade.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: BrigadeStatus.CANCELLED,
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async getEligiblePersonnel() {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
        status: UserStatus.ACTIVE,
        role: { in: [Role.DOCTOR, Role.BRIGADISTA, Role.ADMIN] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
      orderBy: [{ role: 'asc' }, { lastName: 'asc' }],
    });
  }
}

export const brigadesService = new BrigadesService();