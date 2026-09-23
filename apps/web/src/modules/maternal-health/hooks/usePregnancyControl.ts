// =========================================================================
// ARCHIVO: apps/web/src/modules/maternal-health/hooks/usePregnancyControl.ts
// DESCRIPCIÓN: Hook reactivo para el control del embarazo sin renders en cascada.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { maternalHealthService } from '../services/maternal-health.service.js';
import type { PregnancyOverview } from '../types/maternal-health.types.js';

export function usePregnancyControl() {
  const [data, setData] = useState<PregnancyOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      const result = await maternalHealthService.fetchOverview();
      setData(result);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No fue posible cargar el control de embarazo';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const result = await maternalHealthService.fetchOverview();
        if (!isMounted) return;
        setData(result);
        setError(null);
      } catch (err: unknown) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'No fue posible cargar el control de embarazo';
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchOverview();
  }, [fetchOverview]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}