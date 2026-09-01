// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/hooks/usePacientesBrigada.ts
// DESCRIPCIÓN: Hook reactivo para consultar los pacientes de la brigada activa.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { brigadesApiService } from '../services/brigades.service';
import type { PacientesBrigadaData } from '../types/brigade.types';

export interface UsePacientesBrigadaReturn {
  data: PacientesBrigadaData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

export const usePacientesBrigada = (): UsePacientesBrigadaReturn => {
  const [data, setData] = useState<PacientesBrigadaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPacientes = useCallback(async () => {
    try {
      setError(null);
      const result = await brigadesApiService.getPacientesBrigada();
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al consultar el padrón de pacientes de la brigada en la base de datos.';
      setError(message);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const executeInitialFetch = async () => {
      try {
        setError(null);
        const result = await brigadesApiService.getPacientesBrigada();
        if (isMounted) {
          setData(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Error al consultar el padrón de pacientes de la brigada en la base de datos.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void executeInitialFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchPacientes();
    } finally {
      setRefreshing(false);
    }
  }, [fetchPacientes]);

  return {
    data,
    loading,
    error,
    refreshing,
    refresh,
  };
};