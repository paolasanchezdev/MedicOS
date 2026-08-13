// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/actividad/ActividadSistemaPage.tsx
// DESCRIPCIÓN: Página principal de consulta y auditoría de la bitácora del sistema.
// =========================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';

import { EncabezadoActividad } from './components/EncabezadoActividad';
import { FiltrosActividad } from './components/FiltrosActividad';
import { ActividadItem } from './components/ActividadItem';
import { DetalleActividad } from './components/DetalleActividad';
import { ResumenActividad } from './components/ResumenActividad';
import { PaginacionActividad } from './components/PaginacionActividad';
import { AlertCircle, RefreshCw } from 'lucide-react';

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

const INITIAL_FILTERS: AuditLogFilters = {
  page: 1,
  limit: 15,
};

const fetchAuditLogs = async (filters: AuditLogFilters): Promise<PaginatedAuditLogs> => {
  const params = new URLSearchParams();

  if (filters.entity) params.append('entity', filters.entity);
  if (filters.userId) params.append('userId', filters.userId);
  if (filters.role) params.append('role', filters.role);
  if (filters.action) params.append('action', filters.action);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  params.append('page', filters.page.toString());
  params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const endpoint = `/admin/audit-logs${queryString ? `?${queryString}` : ''}`;

  interface BackendAuditLogsResponse {
    items?: AuditLogItem[];
    logs?: AuditLogItem[];
    data?: AuditLogItem[];
    total?: number;
    page?: number;
    totalPages?: number;
    meta?: {
      totalItems?: number;
      total?: number;
      currentPage?: number;
      page?: number;
      totalPages?: number;
    };
  }

  const response = await apiClient<BackendAuditLogsResponse>(endpoint, {
    method: 'GET',
  });

  const itemsRaw = response.items || response.logs || response.data || [];
  const total = response.meta?.totalItems ?? response.meta?.total ?? response.total ?? itemsRaw.length;
  const currentPage = response.meta?.currentPage ?? response.meta?.page ?? response.page ?? filters.page;
  const totalPages = response.meta?.totalPages ?? response.totalPages ?? 1;

  return {
    items: itemsRaw,
    meta: {
      totalItems: total,
      currentPage,
      totalPages,
      itemsPerPage: filters.limit,
    },
  };
};

export const ActividadSistemaPage: React.FC = () => {
  const [filters, setFilters] = useState<AuditLogFilters>(INITIAL_FILTERS);
  const [data, setData] = useState<PaginatedAuditLogs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<AuditLogItem | null>(null);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAuditLogs(filters);
      setData(response);
    } catch (err) {
      setError((err as Error).message || 'No se pudo cargar la actividad del sistema.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let isSubscribed = true;

    const loadAuditLogs = async () => {
      try {
        const response = await fetchAuditLogs(filters);
        if (isSubscribed) {
          setData(response);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No se pudo cargar la actividad del sistema.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadAuditLogs();

    return () => {
      isSubscribed = false;
    };
  }, [filters]);

  return (
    <div className="p-6 space-y-6 w-full">
      <EncabezadoActividad
        totalItems={data?.meta.totalItems ?? 0}
        onRefresh={handleRefresh}
        isRefreshing={loading}
      />

      <FiltrosActividad
        filters={filters}
        onChange={(updated) => setFilters(updated)}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />

      <ResumenActividad totalItems={data?.meta.totalItems ?? 0} />

      {error ? (
        <div className="p-8 text-center bg-white/90 backdrop-blur-md rounded-2xl border border-red-200 shadow-sm">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-700 font-medium mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-xs font-bold rounded-xl shadow-2xs"
          >
            Reintentar
          </button>
        </div>
      ) : loading ? (
        <div className="p-12 text-center bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
          <span className="text-xs text-slate-500 font-medium">Cargando bitácora de auditoría...</span>
        </div>
      ) : data?.items.length === 0 ? (
        <div className="p-12 text-center bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 text-sm text-slate-500 shadow-sm font-medium">
          No se encontraron registros de actividad con los filtros seleccionados.
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Actor</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Acción</th>
                  <th className="p-4">Módulo</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4 text-right">Origen / Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item) => (
                  <ActividadItem
                    key={item.id}
                    item={item}
                    onSelect={(i) => setSelectedItem(i)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <PaginacionActividad
            currentPage={data?.meta.currentPage ?? 1}
            totalPages={data?.meta.totalPages ?? 1}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      )}

      <DetalleActividad
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};