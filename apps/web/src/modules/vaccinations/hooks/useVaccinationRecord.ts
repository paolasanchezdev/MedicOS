// =========================================================================
// ARCHIVO: apps/web/src/modules/vaccinations/hooks/useVaccinationRecord.ts
// DESCRIPCIÓN: Hook para consultar el esquema e historial de vacunación de un paciente.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { vaccinationsService } from '../services/vaccinations.service';
import type { VaccinationRecord } from '../types/vaccination.types';

export function useVaccinationRecord(patientId?: string | null) {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(patientId));
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    if (!patientId) {
      return;
    }

    let isSubscribed = true;

    const fetchRecords = async () => {
      try {
        const data = await vaccinationsService.getPatientVaccinations(patientId);
        if (isSubscribed) {
          setRecords(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'Error al obtener el historial de vacunas.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchRecords();

    return () => {
      isSubscribed = false;
    };
  }, [patientId, refreshTrigger]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    records,
    loading,
    error,
    refresh,
  };
}