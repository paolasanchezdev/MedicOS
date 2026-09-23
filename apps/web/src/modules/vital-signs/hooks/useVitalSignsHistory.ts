// =========================================================================
// ARCHIVO: apps/web/src/modules/vital-signs/hooks/useVitalSignsHistory.ts
// DESCRIPCIÓN: Hook gestor de signos vitales y filtrado temporal reactivo.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { vitalSignsService } from '../services/vital-signs.service.js';
import type { VitalSignsRecord, VitalSignsFilters } from '../types/vital-signs.types.js';

export function useVitalSignsHistory(filters: VitalSignsFilters = {}) {
  const [records, setRecords] = useState<VitalSignsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const { period, from, to } = filters;

  useEffect(() => {
    let isSubscribed = true;

    const fetchHistory = async () => {
      try {
        const data = await vitalSignsService.getMyVitalSignsHistory({ period, from, to });
        if (isSubscribed) {
          setRecords(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible obtener tus signos vitales.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchHistory();

    return () => {
      isSubscribed = false;
    };
  }, [period, from, to, refreshTrigger]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    records,
    latest: records[0] || null,
    loading,
    error,
    refetch,
  };
}