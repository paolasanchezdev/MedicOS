// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/hooks/usePatientRecord.ts
// DESCRIPCIÓN: Hook para obtener y refrescar el expediente clínico completo del paciente sin renders en cascada.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { patientsService } from '../services/patients.service';
import type { PatientHistoryData } from '../types/patient.types';

interface UsePatientRecordReturn {
  historyData: PatientHistoryData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePatientRecord(patientId?: string | null): UsePatientRecordReturn {
  const [historyData, setHistoryData] = useState<PatientHistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecord = useCallback(async () => {
    if (!patientId || !patientId.trim()) {
      setHistoryData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await patientsService.getPatientHistory(patientId.trim());
      if (!data) {
        setError('No se encontró el expediente clínico del paciente solicitado.');
        setHistoryData(null);
      } else {
        setHistoryData(data);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al consultar el expediente clínico.';
      setError(errorMsg);
      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    let isMounted = true;

    const loadAsync = async () => {
      await Promise.resolve();
      if (!isMounted) return;

      if (!patientId || !patientId.trim()) {
        setHistoryData(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await patientsService.getPatientHistory(patientId.trim());
        if (!isMounted) return;

        if (!data) {
          setError('No se encontró el expediente clínico del paciente solicitado.');
          setHistoryData(null);
        } else {
          setHistoryData(data);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const errorMsg = err instanceof Error ? err.message : 'Error al consultar el expediente clínico.';
        setError(errorMsg);
        setHistoryData(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadAsync();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  return {
    historyData,
    loading,
    error,
    refetch: fetchRecord,
  };
}