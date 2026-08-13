// =========================================================================
// ARCHIVO: apps/api/src/modules/admin/admin.service.ts
// DESCRIPCIÓN: Servicio administrativo para métricas del dashboard y auditoría.
// =========================================================================

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

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

export class AdminService {
  async getDashboardSummary() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Rango de los últimos 7 días para la gráfica de tendencia
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      totalUsers,
      usersByRoleRaw,
      usersByStatusRaw,
      totalPatients,
      syncPendingPatients,
      recentPatientsRaw,
      patientsLast7Days,
      totalBrigades,
      brigadesByStatusRaw,
      last24HoursActivity,
      recentAuditLogs,
      totalDevices,
      activeDevices,
      offlineDevices,
      pendingSync,
      processingSync,
      completedSync,
      failedSync,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { _all: true },
        where: { deletedAt: null },
      }),
      prisma.user.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: { deletedAt: null },
      }),
      prisma.patient.count({ where: { deletedAt: null } }),
      prisma.patient.count({ where: { syncStatus: 'PENDING', deletedAt: null } }),
      // Pacientes recientes (últimos 5)
      prisma.patient.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dui: true,
          sex: true,
          createdAt: true,
        },
      }),
      // Pacientes creados en los últimos 7 días para tendencia
      prisma.patient.findMany({
        where: {
          deletedAt: null,
          createdAt: { gte: sevenDaysAgo },
        },
        select: {
          createdAt: true,
        },
      }),
      prisma.brigade.count({ where: { deletedAt: null } }),
      prisma.brigade.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: { deletedAt: null },
      }),
      prisma.auditLog.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.device.count({ where: { deletedAt: null } }),
      prisma.device.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.device.count({ where: { status: 'OFFLINE', deletedAt: null } }),
      prisma.syncQueue.count({ where: { status: 'PENDING' } }),
      prisma.syncQueue.count({ where: { status: 'PROCESSING' } }),
      prisma.syncQueue.count({ where: { status: 'COMPLETED' } }),
      prisma.syncQueue.count({ where: { status: 'FAILED' } }),
    ]);

    // Procesar distribución de usuarios por rol
    const byRole = {
      ADMIN: 0,
      DOCTOR: 0,
      BRIGADISTA: 0,
      AUTHORITY: 0,
      PATIENT: 0,
    };
    usersByRoleRaw.forEach((item) => {
      if (item.role in byRole) {
        byRole[item.role as keyof typeof byRole] = item._count._all;
      }
    });

    // Procesar distribución de usuarios por estado
    const byStatus = {
      ACTIVE: 0,
      INACTIVE: 0,
      SUSPENDED: 0,
    };
    usersByStatusRaw.forEach((item) => {
      if (item.status in byStatus) {
        byStatus[item.status as keyof typeof byStatus] = item._count._all;
      }
    });

    // Procesar distribución de brigadas
    const brigadeStatus = {
      PLANNED: 0,
      ACTIVE: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    brigadesByStatusRaw.forEach((item) => {
      if (item.status in brigadeStatus) {
        brigadeStatus[item.status as keyof typeof brigadeStatus] = item._count._all;
      }
    });

    // Formatear pacientes recientes
    const recentPatients = recentPatientsRaw.map((p) => ({
      id: p.id,
      fullName: `${p.firstName} ${p.lastName}`.trim(),
      documentNumber: p.dui || undefined,
      createdAt: p.createdAt,
      gender: p.sex || undefined,
    }));

    // Construir la estructura de los últimos 7 días de forma nulo-segura
    const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const trendDays: { dayLabel: string; dateStr: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = dayLabels[d.getDay()] ?? '';
      const dateStr = d.toISOString().split('T')[0] ?? '';
      trendDays.push({ dayLabel, dateStr, count: 0 });
    }

    // Contar registros por día
    patientsLast7Days.forEach((p) => {
      const pDateStr = new Date(p.createdAt).toISOString().split('T')[0] ?? '';
      const entry = trendDays.find((td) => td.dateStr === pDateStr);
      if (entry) {
        entry.count += 1;
      }
    });

    const registrationTrend = trendDays.map(({ dayLabel, count }) => ({
      dayLabel,
      count,
    }));

    return {
      users: {
        total: totalUsers,
        byRole,
        byStatus,
      },
      patients: {
        total: totalPatients,
        syncPending: syncPendingPatients,
        recentPatients,
        registrationTrend,
      },
      brigades: {
        total: totalBrigades,
        byStatus: brigadeStatus,
      },
      activity: {
        last24HoursCount: last24HoursActivity,
      },
      recentAuditLogs,
      system: {
        apiOnline: true,
        devicesSummary: {
          total: totalDevices,
          active: activeDevices,
          offline: offlineDevices,
        },
      },
      sync: {
        pending: pendingSync,
        processing: processingSync,
        completed: completedSync,
        failed: failedSync,
      },
    };
  }

  async getAuditLogs(filters: AuditLogFilters) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 15;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters.entity) {
      where.entity = { contains: filters.entity, mode: 'insensitive' };
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.action) {
      where.action = { contains: filters.action, mode: 'insensitive' };
    }

    if (filters.role) {
      where.user = {
        role: filters.role as Role,
      };
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {
        ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
        ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
      };
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          device: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: logs,
      logs,
      total,
      page,
      limit,
      totalPages,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}

export const adminService = new AdminService();