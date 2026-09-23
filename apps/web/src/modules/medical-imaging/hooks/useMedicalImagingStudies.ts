// =========================================================================
// ARCHIVO: apps/web/src/modules/medical-imaging/hooks/useMedicalImagingStudies.ts
// DESCRIPCIÓN: Hook gestor de estudios de imagen con soporte de filtros.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { medicalImagingService } from '../services/medical-imaging.service.js';
import type { MedicalImagingStudy, MedicalImagingFilters } from '../types/medical-imaging.types.js';

export function useMedicalImagingStudies(filters: MedicalImagingFilters = {}) {
  const [studies, setStudies] = useState<MedicalImagingStudy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const { type, status, search, sort } = filters;

  useEffect(() => {
    let isSubscribed = true;

    const fetchStudies = async () => {
      try {
        const data = await medicalImagingService.getMyImagingStudies({ type, status, search, sort });
        if (isSubscribed) {
          setStudies(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible obtener tus estudios de imagen médica.');
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
  }, [type, status, search, sort, refreshTrigger]);

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