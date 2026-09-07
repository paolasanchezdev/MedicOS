// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-history/hooks/usePatientClinicalHistory.ts
// DESCRIPCIÓN: Hook reactivo para cargar antecedentes y alergias del paciente.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import type { ClinicalHistoryData } from '../types/clinical-history.types.js';
import { clinicalHistoryService } from '../services/clinical-history.service.js';

export const usePatientClinicalHistory = () => {
  const [data, setData] = useState<ClinicalHistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerCount, setTriggerCount] = useState<number>(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setTriggerCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    clinicalHistoryService
      .getMyClinicalHistory()
      .then((history) => {
        if (!isMounted) return;
        setData(history);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Error al cargar tu expediente clínico.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [triggerCount]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};