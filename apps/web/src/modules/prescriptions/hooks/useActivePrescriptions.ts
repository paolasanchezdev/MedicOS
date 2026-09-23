// =========================================================================
// ARCHIVO: apps/web/src/modules/prescriptions/hooks/useActivePrescriptions.ts
// DESCRIPCIÓN: Hook gestor de recetas activas, cálculo de días y recarga limpia.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { prescriptionsService } from '../services/prescriptions.service.js';
import type { ActivePrescriptionsSummary } from '../types/prescription.types.js';

export function useActivePrescriptions(patientId?: string | null) {
  const [data, setData] = useState<ActivePrescriptionsSummary>({
    totalPrescriptions: 0,
    totalMedicines: 0,
    nextExpiringItem: null,
    prescriptions: [],
  });
  const [loading, setLoading] = useState<boolean>(Boolean(patientId));
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    if (!patientId) {
      return;
    }

    let isSubscribed = true;

    const fetchPrescriptions = async () => {
      try {
        const res = await prescriptionsService.getActivePrescriptions(patientId);
        if (isSubscribed) {
          setData(res);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'Error al obtener recetas activas.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchPrescriptions();

    return () => {
      isSubscribed = false;
    };
  }, [patientId, refreshTrigger]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    ...data,
    loading: Boolean(patientId) && loading,
    error,
    refresh,
  };
}