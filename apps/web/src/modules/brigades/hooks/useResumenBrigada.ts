// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/hooks/useResumenBrigada.ts
// DESCRIPCIÓN: Hook reactivo para el Resumen Colectivo de la Brigada.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { brigadesApiService } from '../services/brigades.service';
import type { ResumenBrigadaData } from '../types/brigade.types';

export interface UseResumenBrigadaReturn {
  data: ResumenBrigadaData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

export const useResumenBrigada = (): UseResumenBrigadaReturn => {
  const [data, setData] = useState<ResumenBrigadaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      try {
        setError(null);
        const result = await brigadesApiService.getResumenBrigada();
        if (isMounted) {
          setData(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Error al consultar el resumen de la brigada en la base de datos local.';
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
      const result = await brigadesApiService.getResumenBrigada();
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al actualizar el estado de la brigada.';
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