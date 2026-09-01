// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/hooks/useJornadaBrigada.ts
// DESCRIPCIÓN: Hook reactivo para consultar y controlar la Jornada Territorial.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { brigadesApiService } from '../services/brigades.service';
import type { JornadaBrigadaData } from '../types/brigade.types';

export interface UseJornadaBrigadaReturn {
  data: JornadaBrigadaData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  actionLoading: boolean;
  refresh: () => Promise<void>;
  iniciarJornada: () => Promise<void>;
  finalizarJornada: () => Promise<void>;
}

export const useJornadaBrigada = (): UseJornadaBrigadaReturn => {
  const [data, setData] = useState<JornadaBrigadaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchJornada = useCallback(async () => {
    try {
      setError(null);
      const result = await brigadesApiService.getJornadaBrigada();
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al consultar el desarrollo de la jornada en la base de datos local.';
      setError(message);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const executeInitialFetch = async () => {
      try {
        setError(null);
        const result = await brigadesApiService.getJornadaBrigada();
        if (isMounted) {
          setData(result);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : 'Error al consultar el desarrollo de la jornada en la base de datos local.';
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
      await fetchJornada();
    } finally {
      setRefreshing(false);
    }
  }, [fetchJornada]);

  const iniciarJornada = useCallback(async () => {
    setActionLoading(true);
    try {
      setError(null);
      await brigadesApiService.iniciarJornada(data?.identificacion.id);
      await fetchJornada();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo iniciar la jornada.';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  }, [data, fetchJornada]);

  const finalizarJornada = useCallback(async () => {
    setActionLoading(true);
    try {
      setError(null);
      await brigadesApiService.finalizarJornada();
      await fetchJornada();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo finalizar la jornada.';
      setError(message);
    } finally {
      setActionLoading(false);
    }
  }, [fetchJornada]);

  return {
    data,
    loading,
    error,
    refreshing,
    actionLoading,
    refresh,
    iniciarJornada,
    finalizarJornada,
  };
};