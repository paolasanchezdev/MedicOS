// =========================================================================
// ARCHIVO: apps/api/src/modules/admin/admin-dashboard.service.ts
// DESCRIPCIÓN: Servicio administrativo (Versión corregida - Campos de geolocalización pendientes)
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { Role } from '@prisma/client';

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

export interface PaginatedAuditLogs {
  data: unknown[];
  logs: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RecentPatientSummary {
  id: string;
  fullName: string;
  documentNumber?: string | undefined;
  createdAt: Date | string;
  gender?: string | undefined;
}

export interface RegistrationTrendDay {
  dayLabel: string;
  count: number;
}

export interface DeviceNodeLocation {
  id: string;
  name: string;
  locationName?: string;
  status: string;
}

export interface AdminDashboardSummary {
  users: {
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
  };
  patients: {
    total: number;
    syncPending: number;
    recentPatients: RecentPatientSummary[];
    registrationTrend: RegistrationTrendDay[];
  };
  brigades: {
    total: number;
    byStatus: Record<string, number>;
  };
  activity: {
    last24HoursCount: number;
  };
  recentAuditLogs: unknown[];
  system: {
    apiOnline: boolean;
    devicesSummary: {
      total: number;
      active: number;
      offline: number;
    };
    nodes: DeviceNodeLocation[];
  };
  sync: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}

export class AdminDashboardService {
  async getSummary(): Promise<AdminDashboardSummary> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

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
      devicesRaw,
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
      prisma.patient.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dui: true,
          createdAt: true,
          sex: true,
        },
      }),
      prisma.patient.findMany({
        where: {
          deletedAt: null,
          createdAt: { gte: sevenDaysAgo },
        },
        select: { createdAt: true },
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
      prisma.device.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          location: true,
          status: true,
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

    const byRole: Record<string, number> = { ADMIN: 0, DOCTOR: 0, BRIGADISTA: 0, AUTHORITY: 0, PATIENT: 0 };
    usersByRoleRaw.forEach((item) => { byRole[item.role] = item._count._all; });

    const byStatus: Record<string, number> = { ACTIVE: 0, INACTIVE: 0, SUSPENDED: 0 };
    usersByStatusRaw.forEach((item) => { byStatus[item.status] = item._count._all; });

    const brigadeStatus: Record<string, number> = { PLANNED: 0, ACTIVE: 0, COMPLETED: 0, CANCELLED: 0 };
    brigadesByStatusRaw.forEach((item) => { brigadeStatus[item.status] = item._count._all; });

    const recentPatients: RecentPatientSummary[] = recentPatientsRaw.map((p) => {
      const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Paciente sin nombre';
      const patientSummary: RecentPatientSummary = { id: p.id, fullName, createdAt: p.createdAt };
      if (p.dui) patientSummary.documentNumber = p.dui;
      if (p.sex) patientSummary.gender = p.sex;
      return patientSummary;
    });

    const trendMap = new Map<string, { dayLabel: string; count: number }>();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      trendMap.set(dateKey, { dayLabel: dayNames[d.getDay()] ?? '', count: 0 });
    }

    patientsLast7Days.forEach((p) => {
      const d = new Date(p.createdAt);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const entry = trendMap.get(dateKey);
      if (entry) entry.count++;
    });

    const nodes: DeviceNodeLocation[] = devicesRaw.map((dev) => ({
      id: dev.id,
      name: dev.name,
      locationName: dev.location || 'Sede Central',
      status: dev.status,
    }));

    return {
      users: { total: totalUsers, byRole, byStatus },
      patients: { total: totalPatients, syncPending: syncPendingPatients, recentPatients, registrationTrend: Array.from(trendMap.values()) },
      brigades: { total: totalBrigades, byStatus: brigadeStatus },
      activity: { last24HoursCount: last24HoursActivity },
      recentAuditLogs,
      system: {
        apiOnline: true,
        devicesSummary: { total: totalDevices, active: activeDevices, offline: offlineDevices },
        nodes,
      },
      sync: { pending: pendingSync, processing: processingSync, completed: completedSync, failed: failedSync },
    };
  }

  async getAuditLogs(filters: AuditLogFilters): Promise<PaginatedAuditLogs> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 15;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (filters.entity) where.entity = { contains: filters.entity, mode: 'insensitive' };
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = { contains: filters.action, mode: 'insensitive' };
    if (filters.role) where.user = { role: filters.role as Role };
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
          user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
          device: { select: { id: true, name: true, serialNumber: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
    };
  }
}

export const adminDashboardService = new AdminDashboardService();