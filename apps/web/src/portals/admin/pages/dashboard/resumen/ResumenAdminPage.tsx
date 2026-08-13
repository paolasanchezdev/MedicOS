// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/ResumenAdminPage.tsx
// DESCRIPCIÓN: Vista principal con métricas resumidas y estado del sistema.
// =========================================================================

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../../../../core/context/AuthContextInstance';
import { apiClient } from '../../../../../shared/lib/apiClient';

import { TarjetaBienvenidaAdmin } from './components/TarjetaBienvenidaAdmin';
import { TarjetaUsuarios } from './components/TarjetaUsuarios';
import { TarjetaPacientes } from './components/TarjetaPacientes';
import { TarjetaBrigadas } from './components/TarjetaBrigadas';
import { TarjetaActividadSistema } from './components/TarjetaActividadSistema';
import { TarjetaEstadoSistema } from './components/TarjetaEstadoSistema';
import { TarjetaSincronizacion } from './components/TarjetaSincronizacion';
import { ActividadReciente, type AuditLogItem } from './components/ActividadReciente';
import { AccionesRapidas } from './components/AccionesRapidas';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface RecentPatientSummary {
  id: string;
  fullName: string;
  documentNumber?: string;
  createdAt: Date | string;
  gender?: string;
}

export interface RegistrationTrendDay {
  dayLabel: string;
  count: number;
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
    recentPatients?: RecentPatientSummary[];
    registrationTrend?: RegistrationTrendDay[];
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

export const ResumenAdminPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchSummary = async (): Promise<AdminDashboardSummary> => {
    return apiClient<AdminDashboardSummary>('/admin/dashboard/summary', {
      method: 'GET',
    });
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err) {
      setError((err as Error).message || 'No fue posible cargar el resumen administrativo.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const loadSummary = async () => {
      try {
        const data = await fetchSummary();
        if (isSubscribed) {
          setSummary(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible cargar el resumen administrativo.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-slate-200 rounded-2xl" />
          <div className="h-72 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center my-12 bg-white rounded-2xl border border-rose-200 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Error de carga</h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">{error || 'Información no disponible.'}</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* 1. Bienvenida */}
      <TarjetaBienvenidaAdmin
        firstName={auth?.user?.firstName}
        lastName={auth?.user?.lastName}
        role={auth?.user?.role}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      {/* 2. Acciones Rápidas Destacadas (Accesibles sin Scroll) */}
      <AccionesRapidas />

      {/* 3. Métricas y KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TarjetaUsuarios
          total={summary.users.total}
          byRole={summary.users.byRole}
          byStatus={summary.users.byStatus}
        />
        <TarjetaPacientes
          total={summary.patients.total}
          syncPending={summary.patients.syncPending}
          recentPatients={summary.patients.recentPatients}
          registrationTrend={summary.patients.registrationTrend}
        />
        <TarjetaBrigadas
          total={summary.brigades.total}
          byStatus={summary.brigades.byStatus}
        />
        <TarjetaActividadSistema
          last24HoursCount={summary.activity.last24HoursCount}
        />
      </div>

      {/* 4. Actividad Reciente y Monitoreo del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActividadReciente logs={summary.recentAuditLogs} />
        <TarjetaEstadoSistema
          apiOnline={summary.system.apiOnline}
          devicesSummary={summary.system.devicesSummary}
        />
      </div>

      {/* 5. Estado de Sincronización Outbox */}
      <div>
        <TarjetaSincronizacion
          pending={summary.sync.pending}
          processing={summary.sync.processing}
          completed={summary.sync.completed}
          failed={summary.sync.failed}
        />
      </div>
    </div>
  );
};