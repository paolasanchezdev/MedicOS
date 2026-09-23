// =========================================================================
// ARCHIVO: apps/web/src/modules/laboratory/hooks/useLaboratoryResults.ts
// DESCRIPCIÓN: Hook gestor de estudios de laboratorio y filtrado reactivo.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { laboratoryService } from '../services/laboratory.service.js';
import type { LaboratoryStudy, LaboratoryFilters } from '../types/laboratory.types.js';

export function useLaboratoryResults(filters: LaboratoryFilters = {}) {
  const [studies, setStudies] = useState<LaboratoryStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const { status, search, sort } = filters;

  useEffect(() => {
    let isSubscribed = true;

    const fetchStudies = async () => {
      try {
        const data = await laboratoryService.getMyLaboratoryResults({ status, search, sort });
        if (isSubscribed) {
          setStudies(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible obtener los resultados de laboratorio.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchStudies();

    return () => {
      isSubscribed = false;
    };
  }, [status, search, sort, refreshTrigger]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    studies,
    loading,
    error,
    refetch,
  };
}