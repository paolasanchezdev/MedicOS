// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/hooks/useBrigadistaDashboard.ts
// DESCRIPCIÓN: Hook reactivo para el dashboard del brigadista con ciclo de vida seguro.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { brigadistaDashboardApiService } from '../services/brigadista-dashboard.service';
import type { BrigadistaDashboardData } from '../types/brigadista-dashboard.types';

export interface UseBrigadistaDashboardReturn {
  data: BrigadistaDashboardData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

export const useBrigadistaDashboard = (): UseBrigadistaDashboardReturn => {
  const [data, setData] = useState<BrigadistaDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      try {
        setError(null);
        const result = await brigadistaDashboardApiService.getDashboardResumen();
        if (isMounted) {
          setData(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Error al conectar con la base de datos local de la estación.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void executeFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setError(null);
      const result = await brigadistaDashboardApiService.getDashboardResumen();
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al actualizar los datos operativos.';
      setError(message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refreshing,
    refresh,
  };
};