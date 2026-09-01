// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/hooks/useBrigadistaActividad.ts
// DESCRIPCIÓN: Hook reactivo para la bitácora y despacho operativo del Brigadista.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { brigadistaDashboardApiService } from '../services/brigadista-dashboard.service';
import type {
  BrigadistaActividadData,
  BrigadistaActividadFilters,
} from '../types/brigadista-dashboard.types';

export interface UseBrigadistaActividadReturn {
  data: BrigadistaActividadData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: (overrideFilters?: BrigadistaActividadFilters) => Promise<void>;
}

export const useBrigadistaActividad = (
  filters: BrigadistaActividadFilters = {}
): UseBrigadistaActividadReturn => {
  const [data, setData] = useState<BrigadistaActividadData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { search, tipo, estado, temporalidad, startDate, endDate } = filters;

  const executeFetch = useCallback(
    async (currentFilters: BrigadistaActividadFilters, isInitial = false) => {
      if (isInitial) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const result = await brigadistaDashboardApiService.getDashboardActividad(currentFilters);
        setData(result);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Error al consultar la bitácora de actividades en la base de datos local.';
        setError(message);
      } finally {
        if (isInitial) setLoading(false);
        else setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        setError(null);
        const result = await brigadistaDashboardApiService.getDashboardActividad({
          search,
          tipo,
          estado,
          temporalidad,
          startDate,
          endDate,
        });
        if (isMounted) {
          setData(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Error al consultar la bitácora en la base de datos local.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [search, tipo, estado, temporalidad, startDate, endDate]);

  const refresh = useCallback(
    async (overrideFilters?: BrigadistaActividadFilters) => {
      await executeFetch(
        overrideFilters || {
          search,
          tipo,
          estado,
          temporalidad,
          startDate,
          endDate,
        },
        false
      );
    },
    [executeFetch, search, tipo, estado, temporalidad, startDate, endDate]
  );

  return {
    data,
    loading,
    error,
    refreshing,
    refresh,
  };
};