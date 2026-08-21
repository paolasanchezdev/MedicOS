// apps/api/src/modules/admin/admin.service.ts
import prisma from '../../config/prisma.js';
import {
  Establishment,
  EstablishmentType,
  EstablishmentLevel,
  EstablishmentStatus,
  EstablishmentOperator,
  SyncStatus,
  Prisma,
} from '@prisma/client';

export interface AuditLogFilters {
  entity?: string | undefined;
  userId?: string | undefined;
  role?: string | undefined;
  action?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface EstablishmentFiltersInput {
  type?: EstablishmentType | undefined;
  department?: string | undefined;
  status?: EstablishmentStatus | undefined;
  level?: EstablishmentLevel | undefined;
  search?: string | undefined;
}

export interface CreateEstablishmentDto {
  code: string;
  name: string;
  type: EstablishmentType;
  level: EstablishmentLevel;
  operator?: EstablishmentOperator | undefined;
  department: string;
  municipality: string;
  address: string;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  phone?: string | null | undefined;
  emergencyPhone?: string | null | undefined;
  hasEmergency?: boolean | undefined;
  specialties?: string[] | undefined;
  status?: EstablishmentStatus | undefined;
}

export class AdminService {
  // ======================================================
  // DASHBOARD Y AUDITORÍA
  // ======================================================

  async getDashboardSummary() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalPatients,
      totalBrigades,
      last24HoursCount,
      recentLogs,
      usersByRoleRaw,
      usersByStatusRaw,
      brigadesByStatusRaw,
      recentPatientsRaw,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.patient.count({ where: { deletedAt: null } }),
      prisma.brigade.count({ where: { deletedAt: null } }),
      prisma.auditLog.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
      prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
      prisma.user.groupBy({ by: ['role'], _count: { role: true }, where: { deletedAt: null } }),
      prisma.user.groupBy({ by: ['status'], _count: { status: true }, where: { deletedAt: null } }),
      prisma.brigade.groupBy({ by: ['status'], _count: { status: true }, where: { deletedAt: null } }),
      prisma.patient.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, createdAt: true },
      }),
    ]);

    const byRole: Record<string, number> = {};
    usersByRoleRaw.forEach((item) => {
      byRole[item.role] = item._count.role;
    });

    const byStatus: Record<string, number> = {};
    usersByStatusRaw.forEach((item) => {
      if (item.status) byStatus[item.status] = item._count.status;
    });

    const brigadeStatus: Record<string, number> = {};
    brigadesByStatusRaw.forEach((item) => {
      if (item.status) brigadeStatus[item.status] = item._count.status;
    });

    const recentAuditLogs = recentLogs.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      createdAt: log.createdAt,
      userName: log.userId || 'Sistema',
      details: log.changedFields ? JSON.stringify(log.changedFields) : undefined,
    }));

    const recentPatients = recentPatientsRaw.map((p) => ({
      id: p.id,
      fullName: `Paciente #${p.id.slice(0, 6)}`,
      createdAt: p.createdAt,
    }));

    return {
      users: {
        total: totalUsers,
        byRole,
        byStatus,
      },
      patients: {
        total: totalPatients,
        syncPending: 0,
        recentPatients,
        registrationTrend: [],
      },
      brigades: {
        total: totalBrigades,
        byStatus: brigadeStatus,
      },
      activity: {
        last24HoursCount,
      },
      recentAuditLogs,
      system: {
        apiOnline: true,
        devicesSummary: {
          total: 1,
          active: 1,
          offline: 0,
        },
      },
      sync: {
        pending: 0,
        processing: 0,
        completed: totalPatients,
        failed: 0,
      },
    };
  }

  async getAuditLogs(filters: AuditLogFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 15;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};

    if (filters.entity) where.entity = filters.entity;
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {
        ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
        ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
      };
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      logs,
    };
  }

  // ======================================================
  // ESTABLECIMIENTOS (RED DE REFERENCIA)
  // ======================================================

  async getEstablishments(filters: EstablishmentFiltersInput): Promise<Establishment[]> {
    const where: Prisma.EstablishmentWhereInput = {
      deletedAt: null,
    };

    if (filters.type) where.type = filters.type;
    if (filters.department && filters.department !== 'ALL') {
      where.department = { equals: filters.department, mode: 'insensitive' };
    }
    if (filters.status && (filters.status as string) !== 'ALL') where.status = filters.status;
    if (filters.level && (filters.level as string) !== 'ALL') where.level = filters.level;

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } },
        { municipality: { contains: q, mode: 'insensitive' } },
        { department: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
      ];
    }

    return prisma.establishment.findMany({
      where,
      orderBy: { code: 'asc' },
    });
  }

  async createEstablishment(data: CreateEstablishmentDto, deviceId: string): Promise<Establishment> {
    return prisma.establishment.create({
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        level: data.level,
        operator: data.operator ?? EstablishmentOperator.MINSAL,
        department: data.department,
        municipality: data.municipality,
        address: data.address,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        phone: data.phone ?? null,
        emergencyPhone: data.emergencyPhone ?? null,
        hasEmergency: data.hasEmergency ?? true,
        specialties: data.specialties ?? [],
        status: data.status ?? EstablishmentStatus.OPERATIONAL,
        syncStatus: SyncStatus.SYNCED,
        version: 1,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async updateEstablishment(
    id: string,
    data: Partial<CreateEstablishmentDto>,
    deviceId: string
  ): Promise<Establishment> {
    const updateData: Prisma.EstablishmentUpdateInput = {
      ...(data.name ? { name: data.name } : {}),
      ...(data.level ? { level: data.level } : {}),
      ...(data.department ? { department: data.department } : {}),
      ...(data.municipality ? { municipality: data.municipality } : {}),
      ...(data.address ? { address: data.address } : {}),
      ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
      ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.emergencyPhone !== undefined ? { emergencyPhone: data.emergencyPhone } : {}),
      ...(data.hasEmergency !== undefined ? { hasEmergency: data.hasEmergency } : {}),
      ...(data.specialties !== undefined ? { specialties: data.specialties } : {}),
      ...(data.status ? { status: data.status } : {}),
      version: { increment: 1 },
      lastModifiedByDeviceId: deviceId,
    };

    return prisma.establishment.update({
      where: { id },
      data: updateData,
    });
  }

  async updateEstablishmentStatus(
    id: string,
    status: EstablishmentStatus,
    deviceId: string
  ): Promise<Establishment> {
    return prisma.establishment.update({
      where: { id },
      data: {
        status,
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      },
    });
  }
}

export const adminService = new AdminService();