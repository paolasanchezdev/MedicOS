// =========================================================================
// ARCHIVO: apps/web/src/modules/admin/types/admin-dashboard.types.ts
// =========================================================================

export interface AuditLogFilters {
  entity?: string;
  userId?: string;
  role?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  device?: {
    id: string;
    name: string;
    serialNumber: string;
  };
  [key: string]: unknown;
}

export interface PaginatedAuditLogs {
  items: AuditLogItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
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
  };
  brigades: {
    total: number;
    byStatus: Record<string, number>;
  };
  activity: {
    last24HoursCount: number;
  };
  recentAuditLogs: AuditLogItem[];
  system: {
    apiOnline: boolean;
    devicesSummary: {
      total: number;
      active: number;
      offline: number;
    };
  };
  sync: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}