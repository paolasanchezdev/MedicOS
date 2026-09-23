// =========================================================================
// ARCHIVO: apps/web/src/modules/prescriptions/hooks/useMedicationReminders.ts
// DESCRIPCIÓN: Hook gestor de recordatorios con navegación por fecha y mutación optimista.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { prescriptionsService } from '../services/prescriptions.service.js';
import type { DailySchedule } from '../types/prescription.types.js';

export function useMedicationReminders(patientId?: string | null) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<DailySchedule>({
    targetDate: new Date().toISOString(),
    totalToday: 0,
    takenCount: 0,
    progressPercentage: 0,
    currentIntake: null,
    schedule: [],
  });
  const [loading, setLoading] = useState<boolean>(Boolean(patientId));
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    if (!patientId) return;

    let isSubscribed = true;

    const fetchSchedule = async () => {
      try {
        const dateStr = selectedDate.toISOString().slice(0, 10);
        const res = await prescriptionsService.getDailySchedule(patientId, dateStr);
        if (isSubscribed) {
          setData(res);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'Error al cargar los recordatorios.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchSchedule();

    return () => {
      isSubscribed = false;
    };
  }, [patientId, selectedDate, refreshTrigger]);

  const markAsTaken = useCallback(async (intakeId: string) => {
    setMarkingId(intakeId);
    try {
      await prescriptionsService.markIntakeAsTaken(intakeId);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error al registrar toma:', err);
    } finally {
      setMarkingId(null);
    }
  }, []);

  const goToPreviousDay = useCallback(() => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    ...data,
    selectedDate,
    loading: Boolean(patientId) && loading,
    markingId,
    error,
    markAsTaken,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    refresh,
  };
}