// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/actividad/ActividadMedicoPage.tsx
// DESCRIPCIÓN: Vista de Actividad del Médico conectada a endpoints del backend.
// =========================================================================

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { apiClient } from '../../../../../shared/lib/apiClient';

import { EncabezadoActividad } from './components/EncabezadoActividad';
import { ResumenActividad } from './components/ResumenActividad';
import { FiltrosActividad } from './components/FiltrosActividad';
import { ActividadItem } from './components/ActividadItem';
import { DetalleActividad } from './components/DetalleActividad';
import { PaginacionActividad } from './components/PaginacionActividad';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface ActividadMedicoFilters {
  search?: string;
  action?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface ActividadMedicoItem {
  id: string;
  action: string;
  actionLabel?: string;
  description?: string;
  patientName?: string;
  patientDui?: string;
  status?: string;
  isOffline?: boolean;
  createdAt: string;
  deviceSn?: string;
}

export interface PaginatedActividadMedico {
  items: ActividadMedicoItem[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

interface BackendActivityResponse {
  items?: ActividadMedicoItem[];
  data?: ActividadMedicoItem[];
  meta?: {
    totalItems?: number;
    total?: number;
    currentPage?: number;
    page?: number;
    totalPages?: number;
  };
}

const INITIAL_FILTERS: ActividadMedicoFilters = {
  page: 1,
  limit: 10,
};

// Rutas candidatas del backend Express
const ENDPOINTS_TO_TRY = [
  '/medico/dashboard/actividad',
  '/medico/dashboard/activity',
  '/medico/actividad',
  '/medico/activity',
];

const fetchMedicoActivity = async (filters: ActividadMedicoFilters): Promise<PaginatedActividadMedico> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.action) params.append('action', filters.action);
  if (filters.status) params.append('status', filters.status);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  params.append('page', filters.page.toString());
  params.append('limit', filters.limit.toString());

  let lastError: Error | null = null;

  for (const endpoint of ENDPOINTS_TO_TRY) {
    try {
      const response = await apiClient<BackendActivityResponse>(`${endpoint}?${params.toString()}`, {
        method: 'GET',
      });

      const items = response.items || response.data || [];
      const totalItems = response.meta?.totalItems ?? response.meta?.total ?? items.length;
      const currentPage = response.meta?.currentPage ?? response.meta?.page ?? filters.page;
      const totalPages = response.meta?.totalPages ?? (Math.ceil(totalItems / filters.limit) || 1);

      return {
        items,
        meta: {
          totalItems,
          currentPage,
          totalPages,
          itemsPerPage: filters.limit,
        },
      };
    } catch (err) {
      lastError = err as Error;
      // Intenta la siguiente ruta si retorna 404
    }
  }

  throw lastError || new Error('Endpoint de actividad clínica no encontrado en la API.');
};

export const ActividadMedicoPage: React.FC = () => {
  const [filters, setFilters] = useState<ActividadMedicoFilters>(INITIAL_FILTERS);
  const [data, setData] = useState<PaginatedActividadMedico | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActividadMedicoItem | null>(null);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMedicoActivity(filters);
      setData(response);
    } catch (err) {
      setError((err as Error).message || 'No se pudo conectar con el servidor para obtener la actividad clínica.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchMedicoActivity(filters);
        if (isSubscribed) {
          setData(response);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'Ruta del servidor no encontrada (404). Verifica que la API esté activa.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [filters]);

  const totalActividades = useMemo(() => data?.meta.totalItems ?? 0, [data]);

  return (
    <div className="p-6 space-y-6 w-full">
      <EncabezadoActividad
        totalItems={totalActividades}
        onRefresh={handleRefresh}
        isRefreshing={loading}
      />

      <ResumenActividad totalItems={totalActividades} />

      <FiltrosActividad
        filters={filters}
        onChange={(updated) => setFilters(updated)}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />

      {error ? (
        <div className="p-8 text-center bg-white/90 backdrop-blur-md rounded-2xl border border-red-200 shadow-sm">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-slate-700 font-medium mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
          >
            Reintentar Conexión
          </button>
        </div>
      ) : loading ? (
        <div className="p-12 text-center bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
          <span className="text-xs text-slate-500 font-medium">Obteniendo datos en tiempo real de la base de datos...</span>
        </div>
      ) : data?.items.length === 0 ? (
        <div className="p-12 text-center bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 text-sm text-slate-500 shadow-sm font-medium">
          No hay registros reales de actividad registrados para los criterios seleccionados.
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Acción Clínica</th>
                  <th className="p-4">Diagnóstico / Observación</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Hora</th>
                  <th className="p-4 text-right">Detalle</th>
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