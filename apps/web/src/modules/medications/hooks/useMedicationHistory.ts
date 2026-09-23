// =========================================================================
// ARCHIVO: apps/web/src/modules/medications/hooks/useMedicationHistory.ts
// DESCRIPCIÓN: Hook gestor de historial de medicamentos con soporte de filtros.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { medicationsService } from '../services/medications.service.js';
import type {
  MedicationHistoryItem,
  MedicationHistoryFilters,
} from '../types/medication.types.js';

export function useMedicationHistory(filters: MedicationHistoryFilters = {}) {
  const [medications, setMedications] = useState<MedicationHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const { status, search, sort } = filters;

  useEffect(() => {
    let isSubscribed = true;

    const fetchHistory = async () => {
      try {
        const data = await medicationsService.getMyMedicationHistory({ status, search, sort });
        if (isSubscribed) {
          setMedications(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible obtener tus medicamentos registrados.');
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
  }, [status, search, sort, refreshTrigger]);

  const refetch = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    medications,
    loading,
    error,
    refetch,
  };
}