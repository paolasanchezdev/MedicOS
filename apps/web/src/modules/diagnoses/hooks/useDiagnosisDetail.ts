// =========================================================================
// ARCHIVO: apps/web/src/modules/diagnoses/hooks/useDiagnosisDetail.ts
// DESCRIPCIÓN: Hook bajo demanda para cargar la ficha completa de un diagnóstico.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import type { Diagnosis } from '../types/diagnosis.types.js';
import { diagnosesService } from '../services/diagnoses.service.js';

export const useDiagnosisDetail = (diagnosisId: string | null) => {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [triggerCount, setTriggerCount] = useState<number>(0);

  const refetch = useCallback(() => {
    if (diagnosisId) {
      setLoading(true);
      setTriggerCount((prev) => prev + 1);
    }
  }, [diagnosisId]);

  useEffect(() => {
    if (!diagnosisId) {
      return;
    }

    let isMounted = true;

    diagnosesService
      .getDiagnosisById(diagnosisId)
      .then((data) => {
        if (!isMounted) return;
        setDiagnosis(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar el diagnóstico.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [diagnosisId, triggerCount]);

  const activeDiagnosis = diagnosisId ? diagnosis : null;
  const activeError = diagnosisId ? error : null;

  return {
    diagnosis: activeDiagnosis,
    loading,
    error: activeError,
    refetch,
  };
};